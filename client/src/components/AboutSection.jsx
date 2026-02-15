import React from 'react';
import { Upload, Sparkles, Home, ArrowRight, CheckCircle } from 'lucide-react';

export default function AboutSection() {
  const steps = [
    {
      icon: <Upload className="w-12 h-12" />,
      title: 'Architects Upload',
      description: 'Professional architects upload home designs with detailed specifications and images',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      number: '01'
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: 'AI Analysis',
      description: 'Our AI engine analyzes designs based on style, budget, and Vastu compliance',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      number: '02'
    },
    {
      icon: <Home className="w-12 h-12" />,
      title: 'Perfect Match',
      description: 'Users find designs that perfectly match their requirements and budget',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      number: '03'
    },
  ];

  const features = [
    { text: 'AI-Powered Recommendations', icon: '🤖' },
    { text: 'Vastu Compliance Check', icon: '✨' },
    { text: 'Budget-Friendly Options', icon: '💰' },
    { text: 'Expert Architect Network', icon: '👥' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-blue-50 to-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            ✨ HOW IT WORKS
          </span>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            From Vision to Reality
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our intelligent platform connects architects with homeowners to create perfect design matches
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Card */}
              <div className={`${step.bgColor} h-full p-8 rounded-2xl border-2 border-transparent hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl`}>
                {/* Number Badge */}
                <div className={`absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r ${step.color} text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg`}>
                  {step.number}
                </div>

                {/* Icon Container */}
                <div className={`inline-flex p-4 bg-gradient-to-r ${step.color} text-white rounded-xl mb-6 shadow-lg`}>
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-700 leading-relaxed mb-4">{step.description}</p>

                {/* Learn More Link */}
                <a href="#" className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${step.color} bg-clip-text text-transparent hover:gap-3 transition-all`}>
                  Learn more
                  <ArrowRight size={16} />
                </a>
              </div>

              {/* Arrow Connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-8 h-8 bg-white border-2 border-blue-300 rounded-full flex items-center justify-center">
                    <ArrowRight size={20} className="text-blue-500" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl">
          <h3 className="text-3xl font-bold mb-8 text-center">Why Choose AI Home Designer?</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-white/20 group-hover:bg-white/30 transition">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">{feature.text}</h4>
                  <p className="text-blue-100 text-sm">
                    {feature.icon === '🤖' && 'Get personalized recommendations based on your preferences'}
                    {feature.icon === '✨' && 'Designs aligned with traditional Vastu principles'}
                    {feature.icon === '💰' && 'Find designs that fit your budget perfectly'}
                    {feature.icon === '👥' && 'Connect directly with verified architects'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-700 text-lg mb-6">
            Ready to find your dream home design?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Get Started Now
            </button>
            <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300">
              Explore Designs
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 right-10 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </section>
  );
}