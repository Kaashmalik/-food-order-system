import React, { useState, useEffect } from 'react';
import { FaTwitter, FaInstagram, FaFacebookF, FaLinkedinIn, FaQuoteLeft } from 'react-icons/fa';
import TestimonialSlider from '../Testimonial/TestimonialSlider';
import { features, stats } from '../../assets/dummydata';
import { getChefs } from '../../services/chefService';
import { getCompanyProfile } from '../../services/companyProfileService';

const About = () => {
  const [hoveredStat, setHoveredStat] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);

  useEffect(() => {
    loadCompanyProfile();
    loadChefs();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      const data = await getCompanyProfile();
      setCompanyProfile(data.data);
    } catch (err) {
      console.error('Failed to load company profile', err);
      // Use default data if API fails
      setCompanyProfile({
        storyImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        storyContent: "Founded in 2024, Food-Order-Easy began with a simple mission: to deliver exceptional culinary experiences to food lovers everywhere.\n\nWhat started as a small kitchen experiment has blossomed into a thriving food delivery service. Our journey began when our founder realized that exceptional food shouldn't be confined to restaurant walls.\n\nToday, we partner with over 200 local restaurants and employ 50+ delivery professionals to ensure that every meal reaches you in perfect condition, exactly when you need it.",
        founder: {
          name: 'Marco Yansen',
          role: 'Founder & CEO',
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          bio: "With over 15 years of experience in the culinary industry, Marco has been at the forefront of food innovation. His passion for bringing exceptional dining experiences to everyone led to the creation of Food-Order-Easy."
        },
        stats: {
          restaurants: 200,
          deliveryProfessionals: 50,
          citiesServed: 15,
          yearsOfService: 1
        }
      });
    }
  };

  const loadChefs = async () => {
    try {
      setLoading(true);
      const data = await getChefs();
      setTeamMembers(data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 flex justify-center items-center">
        <div className="text-amber-400 text-xl">Loading team members...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 px-4 flex justify-center items-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4">
      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our <span className="text-amber-400">Story</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-amber-100/80 mb-12">
            {companyProfile?.storyContent.split('\n\n')[0]}
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border-8 border-amber-900/30 shadow-2xl inline-block mx-auto">
                <img 
                  src={companyProfile?.storyImage || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"} 
                  alt="Our Restaurant" 
                  className="max-w-full h-auto"
                  style={{ 
                    width: '100%',
                    height: 'auto'
                  }}
                />
              </div>
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-bold mb-6">From Passion to Plate</h2>
              <p className="text-amber-100/80 mb-6">
                {companyProfile?.storyContent.split('\n\n')[1]}
              </p>
              <p className="text-amber-100/80 mb-6">
                {companyProfile?.storyContent.split('\n\n')[2]}
              </p>
              <div className="flex items-center">
                <div className="relative">
                  <div className="border-2 border-amber-700 rounded-full p-1 inline-block">
                    <img 
                      src={companyProfile?.founder?.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"} 
                      alt={companyProfile?.founder?.name || 'Founder'} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold">{companyProfile?.founder?.name || 'Founder'}</h3>
                  <p className="text-amber-400">{companyProfile?.founder?.role || 'Founder & CEO'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#2D1B0E]/30 rounded-3xl my-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div 
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#2D1B0E] to-[#3c2a21] border border-amber-900/30 hover:border-amber-600/50 transition-all"
              onMouseEnter={() => setHoveredStat(0)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 mb-4 transition-transform ${hoveredStat === 0 ? 'scale-110' : ''}`}>
                <FaQuoteLeft className="text-white text-xl" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{companyProfile?.stats?.restaurants || 200}</h3>
              <p className="text-amber-100/80">Restaurants</p>
            </div>
            <div 
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#2D1B0E] to-[#3c2a21] border border-amber-900/30 hover:border-amber-600/50 transition-all"
              onMouseEnter={() => setHoveredStat(1)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 mb-4 transition-transform ${hoveredStat === 1 ? 'scale-110' : ''}`}>
                <FaQuoteLeft className="text-white text-xl" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{companyProfile?.stats?.deliveryProfessionals || 50}+</h3>
              <p className="text-amber-100/80">Delivery Professionals</p>
            </div>
            <div 
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#2D1B0E] to-[#3c2a21] border border-amber-900/30 hover:border-amber-600/50 transition-all"
              onMouseEnter={() => setHoveredStat(2)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 mb-4 transition-transform ${hoveredStat === 2 ? 'scale-110' : ''}`}>
                <FaQuoteLeft className="text-white text-xl" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{companyProfile?.stats?.citiesServed || 15}+</h3>
              <p className="text-amber-100/80">Cities Served</p>
            </div>
            <div 
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#2D1B0E] to-[#3c2a21] border border-amber-900/30 hover:border-amber-600/50 transition-all"
              onMouseEnter={() => setHoveredStat(3)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 mb-4 transition-transform ${hoveredStat === 3 ? 'scale-110' : ''}`}>
                <FaQuoteLeft className="text-white text-xl" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{companyProfile?.stats?.yearsOfService || 1}</h3>
              <p className="text-amber-100/80">Years of Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why We Stand Out</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-[#2D1B0E]/50 p-8 rounded-xl border border-amber-900/30 hover:border-amber-600/50 transition-all group hover:-translate-y-2"
              >
                <div className="text-amber-400 text-3xl mb-6 group-hover:text-amber-300 transition-colors">
                  <feature.icon />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-amber-100/80">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Meet Our Culinary Masters</h2>
          {teamMembers.length === 0 ? (
            <div className="text-center py-8 text-amber-100/80">
              <p>No team members found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={member._id || index} className="bg-[#2D1B0E]/50 rounded-xl overflow-hidden border border-amber-900/30 hover:border-amber-600/50 transition-all group">
                  <div className="relative">
                    <img 
                      src={member.image || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"} 
                      alt={member.name} 
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a120b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                    <p className="text-amber-400 mb-4">{member.role}</p>
                    <p className="text-amber-100/80 mb-6">{member.bio}</p>
                    <div className="flex justify-center space-x-4">
                      {Object.entries(member.social || {}).map(([platform, url]) => {
                        const Icon = {
                          twitter: FaTwitter,
                          instagram: FaInstagram,
                          facebook: FaFacebookF,
                          linkedin: FaLinkedinIn
                        }[platform] || FaFacebookF;
                        
                        return (
                          <a 
                            key={platform} 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            <Icon className="text-xl" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What Our Customers Say</h2>
          <TestimonialSlider />
        </div>
      </section>
    </div>
  );
};

export default About;