
'use client';

import { useProgress } from '@/hooks/use-progress';
import type { HistoryItem } from '@/hooks/use-progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { FileQuestion, MessageCircle, ToyBrick, History as HistoryIcon } from 'lucide-react';
import React from 'react';

const iconMap = {
    quiz: <FileQuestion className="h-5 w-5" />,
    simulation: <ToyBrick className="h-5 w-5" />,
    'role-play': <MessageCircle className="h-5 w-5" />,
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function HistoryDetailView({ item }: { item: HistoryItem }) {
    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    {iconMap[item.type]}
                    {item.title}
                </DialogTitle>
                <DialogDescription>
                    {capitalize(item.details.domain)} domain &bull; Completed on {new Date(item.timestamp).toLocaleString()}
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                {item.type === 'quiz' && item.details && (
                    <div className="space-y-2">
                        <p><strong>Topic:</strong> {item.details.topic}</p>
                        <p><strong>Difficulty:</strong> {item.details.difficulty}</p>
                        <p className="font-bold">Score: {item.details.score} / {item.details.totalQuestions}</p>
                        <h4 className="font-semibold mt-4">Questions & Answers:</h4>
                        <ul className="space-y-3">
                            {item.details.questions.map((q: any, i: number) => (
                                <li key={i} className="p-3 bg-secondary rounded-md">
                                    <p className="font-medium">{i+1}. {q.question}</p>
                                    <p className={`text-sm ${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                        Your answer: {q.selectedAnswer} {q.isCorrect ? '✓' : `(Correct answer: ${q.correctAnswer})`}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {item.type === 'simulation' && item.details && (
                    <div className="space-y-2">
                        <p><strong>Description:</strong> {item.details.description}</p>
                        <h4 className="font-semibold mt-4">Tasks:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {item.details.tasks.map((task: string, i: number) => <li key={i}>{task}</li>)}
                        </ul>
                    </div>
                )}
                {item.type === 'role-play' && item.details && (
                    <div className="space-y-2">
                        <p><strong>Scenario:</strong> {item.details.description}</p>
                        <p><strong>Your Role:</strong> {item.details.userRole}</p>
                        <p><strong>AI's Role:</strong> {item.details.aiRole}</p>
                        <h4 className="font-semibold mt-4">Conversation Transcript:</h4>
                        <div className="space-y-2 p-3 bg-secondary rounded-lg">
                            {item.details.history.map((msg: any, i: number) => (
                                <div key={i} className={`p-2 rounded-md ${msg.role === 'user' ? 'bg-primary/10' : 'bg-background'}`}>
                                    <p className="font-bold text-sm">{msg.role === 'user' ? item.details.userRole : item.details.aiRole}:</p>
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    )
}


export default function History() {
    const { history } = useProgress();
    const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Learning History</CardTitle>
                <CardDescription>A log of your completed activities. Click on an item to see details.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[60vh]">
                    {sortedHistory.length > 0 ? (
                        <div className="space-y-4 pr-4">
                            {sortedHistory.map(item => (
                                <Dialog key={item.id}>
                                    <DialogTrigger asChild>
                                        <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-secondary cursor-pointer transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="p-2 bg-primary/10 rounded-full text-primary">
                                                    {iconMap[item.type]}
                                                </span>
                                                <div>
                                                    <p className="font-semibold">{item.title}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(item.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="capitalize">{item.type}</Badge>
                                        </div>
                                    </DialogTrigger>
                                    <HistoryDetailView item={item} />
                                </Dialog>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 text-muted-foreground">
                            <HistoryIcon className="mx-auto h-12 w-12 mb-4" />
                            <p>Your history is empty.</p>
                            <p>Complete a quiz, simulation, or role-play to start building your history.</p>
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
