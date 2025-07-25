
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Software Engineer',
      company: 'Google',
      content: 'HireAI Hub transformed my job search completely. The AI-optimized CV got me 3x more interviews, and the interview coaching helped me land my dream job at Google!',
      rating: 5,
      avatar: 'SM'
    },
    {
      name: 'James Rodriguez',
      role: 'Marketing Manager',
      company: 'Meta',
      content: 'The job matching feature is incredible. It analyzed my CV against job descriptions and gave me specific suggestions that increased my application success rate by 80%.',
      rating: 5,
      avatar: 'JR'
    },
    {
      name: 'Emily Chen',
      role: 'Data Scientist',
      company: 'Microsoft',
      content: 'As someone who struggled with interviews, the AI coach was a game-changer. The feedback was detailed and actionable. I went from nervous to confident in just a week.',
      rating: 5,
      avatar: 'EC'
    },
    {
      name: 'Michael Thompson',
      role: 'UX Designer',
      company: 'Apple',
      content: 'The ATS optimization feature is brilliant. My CV now passes through all the filters and reaches human reviewers. Got 5 interview calls in my first week!',
      rating: 5,
      avatar: 'MT'
    },
    {
      name: 'Lisa Wang',
      role: 'Product Manager',
      company: 'Amazon',
      content: 'HireAI Hub is like having a personal career coach available 24/7. The AI understands my industry and gives incredibly relevant advice.',
      rating: 5,
      avatar: 'LW'
    },
    {
      name: 'David Kim',
      role: 'Financial Analyst',
      company: 'Goldman Sachs',
      content: 'The folder organization system keeps all my job applications perfectly organized. I can track which CV version I sent to which company effortlessly.',
      rating: 5,
      avatar: 'DK'
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Success stories from our users
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their careers with HireAI Hub
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover-lift rounded-xl border-slate-200 hover:border-blue-200 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-slate-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
