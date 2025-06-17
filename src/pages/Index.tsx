
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PenTool, Send, BookOpen, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface MemoryCapsule {
  id: string;
  title: string;
  message: string;
  aiQuote: string;
  dateCreated: string;
  dateToOpen?: string;
}

const Index = () => {
  const [capsules, setCapsules] = useState<MemoryCapsule[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [currentNote, setCurrentNote] = useState({
    title: '',
    message: '',
    dateToOpen: ''
  });
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);

  useEffect(() => {
    const savedCapsules = localStorage.getItem('memoryCapsules');
    if (savedCapsules) {
      setCapsules(JSON.parse(savedCapsules));
    }
  }, []);

  const generateAIQuote = async () => {
    setIsGeneratingQuote(true);
    // Simulate AI quote generation with meaningful quotes
    const quotes = [
      "The future belongs to those who believe in the beauty of their dreams. Remember that your present thoughts are shaping tomorrow's reality.",
      "You are braver than you believe, stronger than you seem, and more loved than you know. Trust in your journey.",
      "Every moment is a fresh beginning. The seeds you plant today will bloom in ways you cannot yet imagine.",
      "Your story is still being written. Each chapter brings new wisdom, new strength, and new possibilities.",
      "Time has a way of revealing the hidden gifts in our struggles. What challenges you today will strengthen you tomorrow.",
      "The path you're walking now is preparing you for destinations you haven't even dreamed of yet.",
      "Your future self is cheering you on. Keep going, keep growing, keep believing in the magic of your potential."
    ];
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setIsGeneratingQuote(false);
    return randomQuote;
  };

  const saveCapsule = async () => {
    if (!currentNote.title.trim() || !currentNote.message.trim()) {
      toast.error("Please fill in both title and message");
      return;
    }

    const aiQuote = await generateAIQuote();
    const newCapsule: MemoryCapsule = {
      id: Date.now().toString(),
      title: currentNote.title,
      message: currentNote.message,
      aiQuote,
      dateCreated: new Date().toISOString(),
      dateToOpen: currentNote.dateToOpen
    };

    const updatedCapsules = [...capsules, newCapsule];
    setCapsules(updatedCapsules);
    localStorage.setItem('memoryCapsules', JSON.stringify(updatedCapsules));
    
    setCurrentNote({ title: '', message: '', dateToOpen: '' });
    setIsWriting(false);
    toast.success("Your memory capsule has been saved! 💌");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d4a574" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3Ccircle cx="47" cy="7" r="1"/%3E%3Ccircle cx="7" cy="47" r="1"/%3E%3Ccircle cx="47" cy="47" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg">
              <PenTool className="w-8 h-8 text-amber-700" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-amber-900 mb-4" style={{ fontFamily: 'Caveat, cursive' }}>
            AI Memory Capsule
          </h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto" style={{ fontFamily: 'Caveat, cursive' }}>
            Write a note to your future self and let AI add some wisdom to your journey
          </p>
        </div>

        {!isWriting ? (
          <div className="space-y-8">
            {/* Create New Capsule Button */}
            <div className="text-center">
              <Button
                onClick={() => setIsWriting(true)}
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <PenTool className="w-5 h-5 mr-2" />
                Write to Future You
              </Button>
            </div>

            {/* Saved Capsules */}
            {capsules.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-amber-900 text-center mb-8" style={{ fontFamily: 'Caveat, cursive' }}>
                  Your Memory Capsules
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {capsules.map((capsule) => (
                    <Card key={capsule.id} className="bg-white/90 backdrop-blur-sm shadow-xl border-0 transform hover:scale-105 transition-all duration-200 hover:shadow-2xl">
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <BookOpen className="w-5 h-5 text-amber-600" />
                          <span className="text-sm text-amber-600 font-medium">
                            {formatDate(capsule.dateCreated)}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-amber-900" style={{ fontFamily: 'Caveat, cursive' }}>
                          {capsule.title}
                        </h3>
                        
                        <p className="text-amber-800 text-sm leading-relaxed line-clamp-3" style={{ fontFamily: 'Caveat, cursive' }}>
                          {capsule.message}
                        </p>
                        
                        <div className="border-t border-amber-200 pt-4">
                          <div className="flex items-start space-x-2">
                            <Sparkles className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                            <p className="text-sm text-amber-700 italic leading-relaxed" style={{ fontFamily: 'Caveat, cursive' }}>
                              "{capsule.aiQuote}"
                            </p>
                          </div>
                        </div>
                        
                        {capsule.dateToOpen && (
                          <div className="text-xs text-amber-600 bg-amber-50 rounded-full px-3 py-1 text-center">
                            Open on: {formatDate(capsule.dateToOpen)}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Writing Interface */
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-amber-900 mb-2" style={{ fontFamily: 'Caveat, cursive' }}>
                    Dear Future Me...
                  </h2>
                  <p className="text-amber-700" style={{ fontFamily: 'Caveat, cursive' }}>
                    What would you like to remember?
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2" style={{ fontFamily: 'Caveat, cursive' }}>
                      Title
                    </label>
                    <Input
                      placeholder="Give your memory a title..."
                      value={currentNote.title}
                      onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 bg-amber-50/50"
                      style={{ fontFamily: 'Caveat, cursive' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2" style={{ fontFamily: 'Caveat, cursive' }}>
                      Your Message
                    </label>
                    <Textarea
                      placeholder="Write your thoughts, dreams, hopes, or anything you want your future self to remember..."
                      value={currentNote.message}
                      onChange={(e) => setCurrentNote({ ...currentNote, message: e.target.value })}
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 min-h-[200px] bg-amber-50/50 resize-none"
                      style={{ fontFamily: 'Caveat, cursive', fontSize: '16px' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2" style={{ fontFamily: 'Caveat, cursive' }}>
                      When should you read this? (optional)
                    </label>
                    <Input
                      type="date"
                      value={currentNote.dateToOpen}
                      onChange={(e) => setCurrentNote({ ...currentNote, dateToOpen: e.target.value })}
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 bg-amber-50/50"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button
                    onClick={() => setIsWriting(false)}
                    variant="outline"
                    className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveCapsule}
                    disabled={isGeneratingQuote}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {isGeneratingQuote ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Adding AI Wisdom...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Save Memory Capsule
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
