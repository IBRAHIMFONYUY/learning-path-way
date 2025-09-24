import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DomainSelector } from '@/components/domain-selector';
import { Logo } from '@/app/logo';
import { Button } from '@/components/ui/button';

export default function Home() {
  const domains = [
    { name: 'Tech', icon: 'Code', imageId: 'tech' },
    { name: 'Art', icon: 'Palette', imageId: 'art' },
    { name: 'Medicine', icon: 'Stethoscope', imageId: 'medicine' },
    { name: 'Business', icon: 'Briefcase', imageId: 'business' },
    { name: 'Language', icon: 'Languages', imageId: 'language' },
  ];
  const images = Object.fromEntries(PlaceHolderImages.map(img => [img.id, img]));

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Logo />
        <Button variant="ghost">Sign In</Button>
      </header>
      <main className="flex-grow">
        <section
          className="py-20 md:py-32"
          style={{ background: 'linear-gradient(135deg, hsl(197, 71%, 73%), hsl(204, 100%, 97%))' }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary-foreground tracking-tighter mb-4">
              Welcome to AdaptLearn
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-primary-foreground/80 mb-8">
              Your personalized, AI-driven learning journey starts here. Select your domain of interest and let our AI craft a unique educational pathway just for you.
            </p>
          </div>
        </section>

        <section id="domain-selection" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center font-headline mb-4">Choose Your Domain</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Select a field of study to begin your personalized learning adventure. Our AI will generate a custom curriculum tailored to your goals.
            </p>
            <DomainSelector domains={domains} images={images} />
          </div>
        </section>
      </main>
      <footer className="bg-secondary text-secondary-foreground py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AdaptLearn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
