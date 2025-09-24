'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Code,
  Palette,
  Stethoscope,
  Briefcase,
  Languages,
  ArrowRight,
  type LucideProps,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

const iconMap: { [key: string]: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>> } = {
  Code,
  Palette,
  Stethoscope,
  Briefcase,
  Languages,
};

type Domain = {
  name: string;
  icon: string;
  imageId: string;
};

type DomainSelectorProps = {
  domains: Domain[];
  images: { [key: string]: ImagePlaceholder };
};

export function DomainSelector({ domains, images }: DomainSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {domains.map((domain) => {
        const Icon = iconMap[domain.icon];
        const image = images[domain.imageId];
        return (
          <Link
            href={`/dashboard?domain=${domain.name.toLowerCase()}`}
            key={domain.name}
            className="group"
          >
            <Card className="overflow-hidden h-full transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={image?.imageUrl || `https://picsum.photos/seed/${domain.imageId}/600/400`}
                    alt={image?.description || `Placeholder for ${domain.name}`}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                    data-ai-hint={image?.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="w-8 h-8 text-primary" />}
                      <h3 className="text-xl font-bold font-headline">{domain.name}</h3>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
