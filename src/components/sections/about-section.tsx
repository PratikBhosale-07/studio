'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Sarah Johnson',
    title: 'HR Director, TechCorp',
    quote: 'TalentFlow AI has revolutionized how we handle employee development. The AI recommendations are spot-on and have saved our managers countless hours.',
    avatarId: 'avatar1',
  },
  {
    name: 'Michael Chen',
    title: 'Engineering Manager, Innovate Inc.',
    quote: 'My team is more engaged than ever. They can clearly see their career paths and the skills they need to grow. It\'s a game-changer for retention.',
    avatarId: 'avatar2',
  },
  {
    name: 'Emily Rodriguez',
    title: 'Software Engineer, Future Solutions',
    quote: 'For the first time, I feel like I have a real, actionable plan for my career. The platform is intuitive and truly empowering.',
    avatarId: 'avatar3',
  },
];

export default function AboutSection() {
  const getAvatarUrl = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id)?.imageUrl || '';
  };

  return (
    <section id="about" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by Forward-Thinking Companies
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what our partners are saying about TalentFlow AI.
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-full">
                    <CardContent className="flex h-full flex-col justify-between p-6">
                      <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={getAvatarUrl(testimonial.avatarId)} alt={testimonial.name} data-ai-hint="person portrait"/>
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
