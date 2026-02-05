import { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2, Sparkles, AlertCircle, Volume2 } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { getELI5Explanation, checkBackendHealth, ComplexityLevel } from '@/services/eli5Service';

const complexityOptions: { value: ComplexityLevel; label: string; emoji: string }[] = [
  { value: 'eli5', label: 'Like I\'m 5' },
  { value: 'eli10', label: 'Like I\'m 10' },
  { value: 'eli15', label: 'Like I\'m 15' },
  { value: 'summary', label: 'Summary'},
];

export default function ELI5Assistant() {
  const [textInput, setTextInput] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [complexity, setComplexity] = useState<ComplexityLevel>('eli5');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError,
  } = useSpeechRecognition();

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then(healthy => {
      setBackendStatus(healthy ? 'online' : 'offline');
    });
  }, []);

  // Update text input with transcript
  useEffect(() => {
    if (transcript) {
      setTextInput(transcript);
    }
  }, [transcript]);

  const handleSubmit = async () => {
    const textToExplain = textInput.trim();
    if (!textToExplain) {
      setError('Please enter or record some text first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExplanation('');

    try {
      const result = await getELI5Explanation(textToExplain, complexity);
      setExplanation(result.explanation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setTextInput('');
    setExplanation('');
    setError(null);
    resetTranscript();
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setTextInput('');
      startListening();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ELI5 Assistant</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 text-sm ${
              backendStatus === 'online' ? 'text-green-600' : 
              backendStatus === 'offline' ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              <span className={`h-2 w-2 rounded-full ${
                backendStatus === 'online' ? 'bg-green-500' : 
                backendStatus === 'offline' ? 'bg-destructive' : 'bg-muted-foreground animate-pulse'
              }`} />
              {backendStatus === 'checking' ? 'Connecting...' : 
               backendStatus === 'online' ? 'Backend Online' : 'Backend Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold tracking-tight">
            Explain Like I'm Five 
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          I listen to the lecture and explain it while it’s happening.
          </p>
        </div>

        {/* Backend Warning */}
        {backendStatus === 'offline' && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-destructive">Backend not connected</p>
              <p className="text-sm text-muted-foreground mt-1">
                Make sure the Express server is running on <code className="bg-muted px-1 rounded">http://localhost:3001</code>
              </p>
            </div>
          </div>
        )}

        {/* Complexity Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Simplification Level</label>
          <div className="flex flex-wrap gap-2">
            {complexityOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setComplexity(option.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  complexity === option.value
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {option.emoji} {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Lecture Content</label>
            <span className="text-xs text-muted-foreground">
              {textInput.length}/10,000
            </span>
          </div>
          
          <div className="relative">
            <textarea
              value={textInput + interimTranscript}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your lecture notes here or click the microphone to speak..."
              className="w-full h-48 p-4 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={isListening}
            />
            
            {/* Voice Recording Button */}
            {isSupported && (
              <button
                onClick={toggleListening}
                className={`absolute bottom-3 right-3 p-3 rounded-full transition-all ${
                  isListening 
                    ? 'bg-destructive text-destructive-foreground animate-pulse' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
                title={isListening ? 'Stop recording' : 'Start recording'}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            )}
          </div>

          {/* Speech Status */}
          {isListening && (
            <p className="mt-2 text-sm text-primary flex items-center gap-2">
              <Volume2 className="h-4 w-4 animate-pulse" />
              Listening... Speak clearly into your microphone
            </p>
          )}
          
          {speechError && (
            <p className="mt-2 text-sm text-destructive">
              Speech error: {speechError}
            </p>
          )}

          {!isSupported && (
            <p className="mt-2 text-sm text-muted-foreground">
              ⚠️ Speech recognition not supported in this browser. Try Chrome or Edge.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !textInput.trim() || backendStatus !== 'online'}
            className="flex-1 py-3 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Simplifying...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Explain It!
              </>
            )}
          </button>
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="py-3 px-6 rounded-lg bg-muted hover:bg-muted/80 font-medium transition-all"
          >
            Clear
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Explanation Output */}
        {explanation && (
          <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Simplified Explanation</h2>
            </div>
            <div className="prose prose-sm max-w-none">
              {explanation.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-3 last:mb-0 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>ELI5 Lecture Assistant • Making complex topics simple</p>
        </div>
      </footer>
    </div>
  );
}
