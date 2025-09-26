"use client";

import {
  useEffect,
  useState,
  useRef,
  useTransition,
} from "react";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { simulateScenarioAction } from "@/lib/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Bot,
  User,
  Wand2,
  Send,
  Volume2,
  Mic,
  MicOff,
  Camera,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProgress } from "@/hooks/use-progress";

type Message = {
  role: "user" | "model";
  content: string;
};

type Scenario = {
  description: string;
  userRole: string;
  aiRole: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Start Simulation
    </Button>
  );
}

export default function RolePlayLab({ domain }: { domain: string }) {
  const initialState = { data: null, error: null };
  const [state, formAction] = useActionState(
    simulateScenarioAction,
    initialState
  );
  const { toast } = useToast();
  const { incrementRolePlaysCompleted } = useProgress();

  const [messages, setMessages] = useState<Message[]>([]);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [input, setInput] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [_, startTransition] = useTransition();
  const [autoSend, setAutoSend] = useState(true);
  const voiceEnabledRef = useRef(voiceEnabled);
  const recognitionActiveRef = useRef(recognitionActive);
  const ttsUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionStartedRef = useRef(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  useEffect(() => {
    recognitionActiveRef.current = recognitionActive;
  }, [recognitionActive]);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
      setMessages((prev) => prev.slice(0, -1));
    }
    if (state.data) {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: state.data!.response },
      ]);
      if (voiceEnabledRef.current) {
        const shouldResumeMic = recognitionActiveRef.current;
        if (shouldResumeMic) stopRecognition();
        if (state.data.audioDataUri && audioRef.current) {
          try {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          } catch (_) {}
          audioRef.current.onended = () => {
            audioRef.current && (audioRef.current.onended = null);
            if (shouldResumeMic) setTimeout(startRecognition, 300);
          };
          audioRef.current.src = state.data.audioDataUri;
          const playPromise = audioRef.current.play();
          if (playPromise && typeof playPromise.then === "function") {
            playPromise.catch((e) => {
              toast({
                variant: "destructive",
                title: "Audio Playback Error",
                description: "Failed to play AI response audio.",
              });
            });
          }
        } else {
          speakWithBrowserTTS(
            state.data.response,
            scenario?.aiRole,
            shouldResumeMic
          );
        }
      }
    }
  }, [state]);

  const handleStartSimulation = async (formData: FormData) => {
    const newScenario = {
      description: formData.get("scenarioDescription") as string,
      userRole: formData.get("userRole") as string,
      aiRole: formData.get("aiRole") as string,
    };
    setScenario(newScenario);
    setMessages([]);
    setInput(""); // Clear input field
    setInterimTranscript(""); // Clear interim transcript

    const newFormData = new FormData();
    newFormData.append("scenarioDescription", newScenario.description);
    newFormData.append("userRole", newScenario.userRole);
    newFormData.append("aiRole", newScenario.aiRole);
    newFormData.append("history", "[]");
    newFormData.append("voiceChatEnabled", String(voiceEnabled));

    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.playsInline = true;
          videoRef.current.muted = true;
          await videoRef.current.play().catch((e) => {
            console.error("Video playback error:", e);
            toast({
              variant: "destructive",
              title: "Camera Error",
              description: "Failed to start camera. Using default avatar.",
            });
            setMediaStream(null);
            if (videoRef.current) videoRef.current.srcObject = null;
          });
        }
        if (!recognitionStartedRef.current) {
          startRecognition();
          recognitionStartedRef.current = true;
        }
      } catch (err) {
        console.error("Media access error:", err);
        toast({
          variant: "destructive",
          title: "Media Access Denied",
          description:
            "Camera and microphone access denied. Using default avatar.",
        });
        if (videoRef.current) videoRef.current.srcObject = null;
      }
    } else {
      toast({
        variant: "destructive",
        title: "Media Not Supported",
        description: "Your browser does not support camera access.",
      });
    }

    startTransition(() => {
      formAction(newFormData);
    });
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || !scenario) return;
    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const formData = new FormData();
    formData.append("scenarioDescription", scenario.description);
    formData.append("userRole", scenario.userRole);
    formData.append("aiRole", scenario.aiRole);
    formData.append(
      "history",
      JSON.stringify(
        newMessages.map((m) => ({ role: m.role, content: m.content }))
      )
    );
    formData.append("voiceChatEnabled", String(voiceEnabled));
    startTransition(() => {
      formAction(formData);
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input;
    setInput("");
    sendMessage(text);
  };

  const handleNewScenario = () => {
    if (scenario && messages.length > 1) {
      incrementRolePlaysCompleted();
      toast({
        title: "Role-Play Completed!",
        description: "Your progress has been updated.",
      });
    }
    // Reset all states
    setScenario(null);
    setMessages([]);
    setInput("");
    setInterimTranscript("");
    setVoiceEnabled(true);
    setAutoSend(true);
    setRecognitionActive(false);
    recognitionStartedRef.current = false;

    // Stop media stream and clear video
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
    // Stop recognition
    stopRecognition();
    // Stop any ongoing speech synthesis
    try {
      window?.speechSynthesis?.cancel();
    } catch (_) {}
    // Reset form if needed
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const startRecognition = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition: any =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: "destructive",
        title: "Speech Not Supported",
        description: "Web Speech API is not available in this browser.",
      });
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    if (audioRef.current && !audioRef.current.paused) {
      try {
        audioRef.current.pause();
      } catch (_) {}
    }
    try {
      window?.speechSynthesis?.cancel();
    } catch (_) {}
    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript + " ";
        } else {
          interimText += transcript + " ";
        }
      }
      if (interimText) setInterimTranscript(interimText.trim());
      if (finalText) {
        const text = finalText.trim();
        setInterimTranscript("");
        if (autoSend) {
          sendMessage(text);
        } else {
          setInput((prev) => (prev ? prev + " " : "") + text);
        }
      }
    };
    recognition.onerror = (event: any) => {
      setRecognitionActive(false);
      toast({
        variant: "destructive",
        title: "Speech Recognition Error",
        description: event.error,
      });
    };
    recognition.onend = () => {
      setRecognitionActive(false);
      recognitionRef.current = null;
    };
    try {
      recognition.start();
      recognitionRef.current = recognition;
      setRecognitionActive(true);
    } catch (_) {
      setRecognitionActive(false);
    }
  };

  const stopRecognition = () => {
    if (typeof window === "undefined") return;
    if (recognitionRef.current && recognitionRef.current.stop) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    recognitionRef.current = null;
    setRecognitionActive(false);
  };

  const getPreferredVoice = (
    voices: SpeechSynthesisVoice[],
    aiRole?: string | null
  ) => {
    const role = (aiRole || "").toLowerCase();
    const preferFemale = /female|woman|girl|nurse|mrs|ms|madam/.test(role);
    const preferMale = /male|man|boy|mr|sir|doctor|coach/.test(role);
    const byGenderHeuristic = (v: SpeechSynthesisVoice) => {
      const n = (v.name + " " + v.voiceURI).toLowerCase();
      const isFemale =
        /(female|woman|samantha|victoria|karen|serena|zira|nora|laila|lucy)/.test(
          n
        );
      const isMale = /(male|man|daniel|alex|fred|tom|mike|arthur|george)/.test(
        n
      );
      return { isFemale, isMale };
    };
    if (preferFemale) {
      const f = voices.find((v) => byGenderHeuristic(v).isFemale);
      if (f) return f;
    }
    if (preferMale) {
      const m = voices.find((v) => byGenderHeuristic(v).isMale);
      if (m) return m;
    }
    return (
      voices.find((v) => v.lang.startsWith("en")) ||
      voices.find((v) => v.default) ||
      voices[0]
    );
  };

  const speakWithBrowserTTS = (
    text: string,
    aiRole?: string | null,
    resumeMicAfter?: boolean
  ) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    try {
      synth.cancel();
    } catch (_) {}
    const utter = new SpeechSynthesisUtterance(text);
    const assignVoiceAndSpeak = () => {
      const voices = synth.getVoices();
      utter.voice = getPreferredVoice(voices, aiRole || undefined);
      utter.rate = 1.0;
      utter.pitch = 1.0;
      ttsUtteranceRef.current = utter;
      utter.onend = () => {
        if (resumeMicAfter) setTimeout(startRecognition, 300);
      };
      try {
        synth.speak(utter);
      } catch (_) {}
    };
    if (synth.getVoices().length === 0) {
      const handler = () => {
        assignVoiceAndSpeak();
        synth.removeEventListener("voiceschanged", handler);
      };
      synth.addEventListener("voiceschanged", handler);
      setTimeout(assignVoiceAndSpeak, 300);
    } else {
      assignVoiceAndSpeak();
    }
  };

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-64px)] flex flex-col lg:flex-row gap-4">
      {/* Form Section */}
      <Card className="lg:w-1/3 w-full shrink-0">
        <form action={handleStartSimulation} ref={formRef}>
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
              <Input
                id="userRole"
                name="userRole"
                placeholder={`e.g., Doctor in ER`}
                required
                disabled={!!scenario}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aiRole">AI's Role</Label>
              <Input
                id="aiRole"
                name="aiRole"
                placeholder={`e.g., Anxious patient`}
                required
                disabled={!!scenario}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="voice">Voice Chat (TTS)</Label>
              <Button
                type="button"
                variant={voiceEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setVoiceEnabled((v) => !v)}
                disabled={!!scenario}
              >
                <Volume2 className="h-4 w-4 mr-2" />{" "}
                {voiceEnabled ? "On" : "Off"}
              </Button>
            </div>
            <audio ref={audioRef} hidden />
          </CardContent>
          <CardFooter>
            {!scenario ? (
              <SubmitButton />
            ) : (
              <Button
                onClick={handleNewScenario}
                variant="outline"
                className="w-full"
              >
                Start New Scenario
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>

      {/* Chat Section */}
      <Card className="lg:w-2/3 w-full flex flex-col h-full">
        <CardHeader>
          <CardTitle>Simulation Chat</CardTitle>
          <CardDescription>
            {scenario
              ? `${scenario.userRole} vs. ${scenario.aiRole}`
              : "Start a scenario to begin the chat."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 overflow-hidden p-0">
          {scenario && (
            <div className="sticky top-0 z-10 bg-background p-4">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                {mediaStream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Video element error:", e);
                      toast({
                        variant: "destructive",
                        title: "Camera Display Error",
                        description: "Failed to display camera feed.",
                      });
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-muted">
                    <img
                      src="/default-avatar.png"
                      alt="No camera"
                      className="h-24 w-24 rounded-full mb-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      Camera unavailable
                    </p>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/90 dark:bg-black/60 text-sm px-3 py-1.5 rounded-full">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <span className="font-medium">{scenario.aiRole}</span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-2 flex-wrap">
                  <Button
                    type="button"
                    size="sm"
                    variant={voiceEnabled ? "default" : "outline"}
                    onClick={() => setVoiceEnabled((v) => !v)}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {voiceEnabled ? "TTS On" : "TTS Off"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={recognitionActive ? "default" : "outline"}
                    onClick={() =>
                      recognitionActive ? stopRecognition() : startRecognition()
                    }
                  >
                    {recognitionActive ? (
                      <Mic className="h-4 w-4 mr-2" />
                    ) : (
                      <MicOff className="h-4 w-4 mr-2" />
                    )}
                    {recognitionActive ? "Listening" : "Mic"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={autoSend ? "default" : "outline"}
                    onClick={() => setAutoSend((v) => !v)}
                  >
                    {autoSend ? "Auto-send" : "Manual"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={mediaStream ? "default" : "outline"}
                    onClick={async () => {
                      if (mediaStream) {
                        mediaStream.getTracks().forEach((track) => track.stop());
                        setMediaStream(null);
                        if (videoRef.current) {
                          videoRef.current.srcObject = null;
                          videoRef.current.pause();
                        }
                      } else {
                        try {
                          const stream = await navigator.mediaDevices.getUserMedia({
                            video: { facingMode: "user" },
                            audio: true,
                          });
                          setMediaStream(stream);
                          if (videoRef.current) {
                            videoRef.current.srcObject = stream;
                            videoRef.current.playsInline = true;
                            videoRef.current.muted = true;
                            // Delay play slightly to ensure user gesture context
                            setTimeout(async () => {
                              try {
                                await videoRef.current?.play();
                              } catch (e) {
                                console.error("Camera restart error:", e);
                                toast({
                                  variant: "destructive",
                                  title: "Camera Error",
                                  description: "Failed to restart camera.",
                                });
                                setMediaStream(null);
                                if (videoRef.current) videoRef.current.srcObject = null;
                              }
                            }, 100);
                          }
                        } catch (err) {
                          console.error("Camera access error:", err);
                          toast({
                            variant: "destructive",
                            title: "Camera Access Denied",
                            description: "Using default avatar instead.",
                          });
                          if (videoRef.current) videoRef.current.srcObject = null;
                        }
                      }
                    }}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {mediaStream ? "Camera On" : "Camera Off"}
                  </Button>
                </div>
                {interimTranscript && (
                  <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                    <div className="max-w-[80%] bg-white/90 dark:bg-black/60 text-sm px-3 py-2 rounded-md">
                      <span className="opacity-80">{interimTranscript}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-8">
                  <Wand2 className="h-12 w-12 mb-4 text-primary" />
                  <p className="text-lg">
                    Your role-play simulation will begin here.
                  </p>
                  <p className="text-sm max-w-sm">
                    Fill out the form and click "Start Simulation" to get a
                    response from the AI.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      message.role === "user" ? "justify-end" : ""
                    }`}
                  >
                    {message.role === "model" && (
                      <div className="p-2 bg-primary text-primary-foreground rounded-full">
                        <Bot size={20} />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-lg max-w-[80%] ${
                        message.role === "user"
                          ? "bg-primary/10"
                          : "bg-secondary"
                      }`}
                    >
                      <p className="font-semibold text-sm mb-1">
                        {message.role === "user"
                          ? scenario?.userRole
                          : scenario?.aiRole}
                      </p>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <div className="p-2 bg-secondary text-secondary-foreground rounded-full">
                        <User size={20} />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={handleSendMessage} className="w-full flex gap-2">
            <Textarea
              placeholder="Your response..."
              className="flex-1 min-h-[60px] max-h-[120px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={!scenario}
            />
            <Button
              type="submit"
              disabled={!scenario || !input.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}