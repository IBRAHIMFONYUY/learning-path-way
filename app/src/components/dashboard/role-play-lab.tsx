
'use client';

import { useEffect, useState, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { simulateScenarioAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Bot, User, Wand2, Send, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProgress } from '@/hooks/use-progress';
import { Switch } from '@/components/ui/switch';

type Message = {
  role: 'user' | 'model';
  content: string;
  audioDataUri?: string;
};

type Scenario = {
  description: string;
  userRole: string;
  aiRole: string;
  voiceChatEnabled: boolean;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Start Simulation
    </Button>
  );
}

export default function RolePlayLab({ domain }: { domain: string }) {
  const initialState = { data: null, error: null };
  const [state, formAction, isPending] = useActionState(simulateScenarioAction, initialState);
  const { toast } = useToast();
  const { incrementRolePlaysCompleted } = useProgress();

  const [messages, setMessages] = useState<Message[]>([]);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [input, setInput] = useState('');
  const [voiceChatEnabled, setVoiceChatEnabled] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);


  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);


  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
      // Remove the last message if it was optimistic
      setMessages(prev => prev.slice(0, -1));
    }
    if (state.data) {
      const newAiMessage: Message = { 
        role: 'model', 
        content: state.data.response,
        audioDataUri: state.data.audioDataUri,
       };
      setMessages(prev => [...prev, newAiMessage]);
      if (newAiMessage.audioDataUri && audioRef.current) {
        audioRef.current.src = newAiMessage.audioDataUri;
        audioRef.current.play().catch(e => console.error("Audio playback failed", e));
      }
    }
  }, [state, toast]);

  const handleStartSimulation = (formData: FormData) => {
    const newScenario: Scenario = {
      description: formData.get('scenarioDescription') as string,
      userRole: formData.get('userRole') as string,
      aiRole: formData.get('aiRole') as string,
      voiceChatEnabled: voiceChatEnabled,
    };
    setScenario(newScenario);
    setMessages([]);

    const newFormData = new FormData();
    newFormData.append('scenarioDescription', newScenario.description);
    newFormData.append('userRole', newScenario.userRole);
    newFormData.append('aiRole', newScenario.aiRole);
    newFormData.append('history', '[]');
    newFormData.append('voiceChatEnabled', String(newScenario.voiceChatEnabled));
    
    formAction(newFormData);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !scenario || isPending) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    const formData = new FormData();
    formData.append('scenarioDescription', scenario.description);
    formData.append('userRole', scenario.userRole);
    formData.append('aiRole', scenario.aiRole);
    formData.append('history', JSON.stringify(newMessages.map(m => ({role: m.role, content: m.content}))));
    formData.append('voiceChatEnabled', String(scenario.voiceChatEnabled));

    formAction(formData);
  };

  const handleNewScenario = () => {
    if (scenario && messages.length > 1) { // 1 initial message from AI
        incrementRolePlaysCompleted();
        toast({
            title: "Role-Play Completed!",
            description: "Your progress has been updated."
        })
    }
    setScenario(null);
    setMessages([]);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <Card className="lg:col-span-1 sticky top-6">
        <form action={handleStartSimulation}>
          <CardHeader>
            <CardTitle>Role-Play Lab</CardTitle>
            <CardDescription>
              Set up a scenario and practice your skills with an AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input type="hidden" name="domain" value={domain} />
            <div className="space-y-2">
              <Label htmlFor="scenarioDescription">Scenario Description</Label>
              <Textarea
                id="scenarioDescription"
                name="scenarioDescription"
                placeholder={`e.g., A patient comes in with chest pain (${domain})`}
                required
                rows={4}
                disabled={!!scenario}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userRole">Your Role</Label>
              <Input id="userRole" name="userRole" placeholder={`e.g., Doctor in ER`} required disabled={!!scenario} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aiRole">AI's Role</Label>
              <Input id="aiRole" name="aiRole" placeholder={`e.g., Anxious patient`} required disabled={!!scenario} />
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="voice-chat" checked={voiceChatEnabled} onCheckedChange={setVoiceChatEnabled} disabled={!!scenario} />
                <Label htmlFor="voice-chat">Enable Voice Chat (AI TTS)</Label>
            </div>
          </CardContent>
          <CardFooter>
            {!scenario ? (
              <SubmitButton />
            ) : (
              <Button onClick={handleNewScenario} variant="outline" className="w-full">
                Start New Scenario
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Simulation Chat</CardTitle>
          <CardDescription>
            {scenario ? `${scenario.userRole} vs. ${scenario.aiRole}` : 'Start a scenario to begin the chat.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full pr-4" ref={chatContainerRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-24">
                  <Wand2 className="h-12 w-12 mb-4 text-primary" />
                  <p className="text-lg">Your role-play simulation will begin here.</p>
                  <p className="text-sm max-w-sm">Fill out the form and click "Start Simulation" to get a response from the AI.</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {message.role === 'model' && (
                       <div className="p-2 bg-primary text-primary-foreground rounded-full">
                        <Bot size={20} />
                       </div>
                    )}
                     <div className={`p-3 rounded-lg max-w-[80%] ${message.role === 'user' ? 'bg-primary/10' : 'bg-secondary'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-semibold text-sm">{message.role === 'user' ? scenario?.userRole : scenario?.aiRole}</p>
                          {message.role === 'model' && message.audioDataUri && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={() => {
                                if (audioRef.current) {
                                    audioRef.current.src = message.audioDataUri!;
                                    audioRef.current.play();
                                }
                            }}>
                                <Volume2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                     </div>
                    {message.role === 'user' && (
                         <div className="p-2 bg-secondary text-secondary-foreground rounded-full">
                            <User size={20} />
                        </div>
                    )}
                  </div>
                ))
              )}
               {isPending && messages.length > 0 && (
                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary text-primary-foreground rounded-full">
                        <Bot size={20} />
                    </div>
                    <div className="bg-secondary p-3 rounded-lg max-w-[80%] flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
               )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-4 border-t">
          <form onSubmit={handleSendMessage} className="w-full flex gap-2">
            <Textarea
              placeholder="Your response..."
              className="flex-grow"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={!scenario || isPending}
            />
            <Button type="submit" disabled={!scenario || isPending || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
}
