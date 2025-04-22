import { useRef, useEffect } from "react"

import Navbar from "../components/Navbar"
//Why choose OFS image
import wheatField from "../assets/wheatField.jpg"

//icons
import reactIcon from "../assets/aboutpage/reactIcon.png"
import nodeIcon from "../assets/aboutpage/nodeIcon.png"
import mysqlIcon from "../assets/aboutpage/mysqlIcon.png"
import stripeIcon from "../assets/aboutpage/stripeIcon.svg"
import tailwindIcon from "../assets/aboutpage/tailwindIcon.svg"
import viteIcon from "../assets/aboutpage/viteIcon.png"
import redisIcon from "../assets/aboutpage/redisIcon.png"
import mapBoxIcon from "../assets/aboutpage/mapBoxIcon.png"
import expressIcon from "../assets/aboutpage/expressIcon.png"
import bullIcon from "../assets/aboutpage/bullIcon.png"
//team pictures
import rayProfile from "../assets/team/rayProfile.jpg"
import michaelProfile from "../assets/team/michaelProfile.jpg"
import dannyProfile from "../assets/team/dannyProfile.jpg"
import anProfile from "../assets/team/anProfile.jpg"
import trinityProfile from "../assets/team/trinityProfile.jpg"
import timothyProfile from "../assets/team/timothyProfile.jpg"
import teamPicture from "../assets/team/teamPicture.jpg"

function AboutPage() {
  // Refs for scroll animations
  const featuresRef = useRef(null)
  const whyChooseRef = useRef(null)
  const teamRef = useRef(null)
  const techRef = useRef(null)

  // Features with SVG icons
  const features = [
    {
      title: "Fast",
      description: "Quick delivery to your doorstep",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
          <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
          <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104a1.837 1.837 0 00-1.47-.725H15.75z" />
          <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
        </svg>
      ),
    },
    {
      title: "Reliable",
      description: "Consistent quality you can trust",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
          <path
            fillRule="evenodd"
            d="M20.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 15.586 19.293 5.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: "On Demand",
      description: "Available when you need it",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4.8 4.8" fill="currentColor">
          <circle cx="2.4" cy="2.4" r="2" stroke="currentColor" strokeWidth="0.3" fill="none" />
          <line x1="2.4" y1="2.4" x2="2.4" y2="1.4" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" />
          <line x1="2.4" y1="2.4" x2="3.4" y2="2.4" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" />
          <circle cx="2.4" cy="2.4" r="0.15" fill="currentColor" />
        </svg>
      ),
    },
  ]

  // Scroll animation setup
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        // Add the animation class when element enters viewport
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        } else {
          // Remove the animation class when element leaves viewport
          // This allows the animation to play again when scrolling back
          entry.target.classList.remove("animate-in")
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)

    // Observe all elements with animation classes
    document.querySelectorAll(".fade-up, .fade-in, .slide-in-left, .slide-in-right").forEach((el) => {
      observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full py-20 overflow-hidden bg-gradient-to-r from-green-50 to-green-100">
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 fade-up">
            About <span className="text-green-600">OFS</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl fade-up delay-100">
            We're on a mission to deliver fresh, organic products directly to your doorstep with speed and reliability.
          </p>
        </div>
        <div className="absolute -bottom-10 right-0 w-64 h-64 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-300 rounded-full opacity-20 blur-2xl"></div>
      </section>

      {/* Attention Grabber - Removed hover effect */}
      <section ref={featuresRef} className="container mx-auto text-center py-16 px-6">
        <div className="px-4 md:px-12 pb-12">
          <div className="text-center fade-in">
            <div className="flex items-center justify-center">
              <div className="border-t border-green-500 w-32"></div>
              <h2 className="mx-4 text-2xl text-green-600 italic font-medium">OFS Delivery Is</h2>
              <div className="border-t border-green-500 w-32"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`text-center p-8 rounded-xl bg-white shadow-lg transition-all duration-300 fade-up`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-green-600 flex items-center justify-center mx-auto mb-6 max-w-[75px] h-[75px]">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose OFS section */}
      <section ref={whyChooseRef} className="container mx-auto px-6 py-20 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 slide-in-left">
            <div className="relative">
              <img
                src={wheatField || "/placeholder.svg"}
                alt="Wheat Field"
                className="w-full rounded-lg shadow-2xl pointer-events-none select-none"
              />
              <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-green-500 rounded-lg -z-10"></div>
            </div>
          </div>
          <div className="md:w-1/2 slide-in-right">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-l-4 border-green-500 pl-4">Why choose OFS?</h2>
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              At OFS, we are dedicated to bringing you fresh, organic products at affordable prices. By sourcing
              locally, we proudly support nearby farms and communities, ensuring that every purchase helps strengthen
              your local economy.
            </p>
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              We prioritize your convenience with fast, reliable, and on-demand delivery, allowing you to spend more
              time on the things that matter most. As a bonus, orders under 20 lbs qualify for free delivery—no need to
              worry about extra fees on smaller purchases.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Clear communication is central to our service. All your past orders are safely stored and easily
              accessible, and you'll always receive real-time updates on your deliveries, giving you peace of mind from
              checkout to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the team section with GitHub links (without text labels) */}
      <section ref={teamRef} className="py-20 px-6 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 fade-in">Meet the team behind OFS</h1>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-12 fade-in delay-100"></div>

          <div className="container mx-auto flex flex-col items-center justify-center gap-8 mb-16">
            <div className="relative fade-in delay-200">
              <img
                src={teamPicture || "/placeholder.svg"}
                alt="OFS Team"
                className="w-full max-w-4xl rounded-lg shadow-xl object-cover pointer-events-none select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
            </div>
            <p className="text-xl italic text-gray-700 mt-6 fade-in delay-300">Committed To Bringing You The Best</p>
          </div>

          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {[
              { img: anProfile, name: "An Ho", github: "https://github.com/OANNAOH" },
              { img: dannyProfile, name: "Danny Xu", github: "https://github.com/pocafup" },
              { img: michaelProfile, name: "Michael Huh", github: "https://github.com/mikeshuh" },
              { img: rayProfile, name: "Ray Zhang", github: "https://github.com/RayZYunYan" },
              { img: trinityProfile, name: "Trinity Manansala", github: "https://github.com/6manansalaT" },
              { img: timothyProfile, name: "Timothy Nguyen", github: "https://github.com/TimothyCNguyen" },
            ].map((member, index) => (
              <div key={index} className="group fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 relative">
                    <div className="p-6">
                      <div className="w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full border-4 border-green-100 group-hover:border-green-300 transition-all duration-300">
                        <img
                          src={member.img || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover pointer-events-none select-none group-hover:scale-110 transition-all duration-500"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                      <div className="absolute top-4 right-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section - with wider container and larger logos */}
      <section ref={techRef} className="py-20 px-6 bg-gradient-to-b from-green-50 to-green-100">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 fade-in">Technologies Used For This Website</h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-8 fade-in delay-100"></div>
        </div>

        <style>
          {`
          .infinite-carousel-container {
            width: 100%;
            max-width: 1320px;
            margin: 0 auto;
            position: relative;
            padding: 25px 0;
            overflow: hidden;
          }

          .infinite-carousel-track {
            display: flex;
            width: max-content;
            animation: infiniteScroll 30s linear infinite;
            padding: 20px 0;
          }

          @keyframes infiniteScroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-190px * 10));  /* Slide width * number of unique slides */
            }
          }

          .tech-logo {
            width: 190px;
            padding: 0 20px;
            flex-shrink: 0;
            z-index: 1;
            transform-style: preserve-3d;
            perspective: 1000px;
          }

          .tech-logo-container {
            background-color: white;
            padding: 1.75rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 150px;
            position: relative;
            z-index: 2;
          }

          .tech-logo-container:hover {
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            transform: scale(1.1);
            z-index: 10;
          }

          /* Animation classes */
          .fade-up {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
          }

          .fade-in {
            opacity: 0;
            transition: opacity 0.8s ease;
          }

          .slide-in-left {
            opacity: 0;
            transform: translateX(-50px);
            transition: opacity 0.8s ease, transform 0.8s ease;
          }

          .slide-in-right {
            opacity: 0;
            transform: translateX(50px);
            transition: opacity 0.8s ease, transform 0.8s ease;
          }

          .animate-in {
            opacity: 1;
            transform: translate(0, 0);
          }

          .delay-100 {
            transition-delay: 100ms;
          }

          .delay-200 {
            transition-delay: 200ms;
          }

          .delay-300 {
            transition-delay: 300ms;
          }
          `}
        </style>

        <div className="container mx-auto fade-in">
          <div className="infinite-carousel-container">
            <div className="infinite-carousel-track">
              {/* First set of logos */}
              {[
                { src: reactIcon, alt: "React" },
                { src: viteIcon, alt: "Vite" },
                { src: tailwindIcon, alt: "Tailwind CSS" },
                { src: nodeIcon, alt: "Node.js" },
                { src: expressIcon, alt: "Express" },
                { src: mysqlIcon, alt: "MySQL" },
                { src: redisIcon, alt: "Redis" },
                { src: bullIcon, alt: "Bull" },
                { src: stripeIcon, alt: "Stripe" },
                { src: mapBoxIcon, alt: "MapBox" },
              ].map((tech, index) => (
                <div className="tech-logo" key={`original-${index}`}>
                  <div className="tech-logo-container">
                    <img
                      src={tech.src || "/placeholder.svg"}
                      alt={tech.alt}
                      className="h-24 w-24 sm:h-28 sm:w-28 object-contain pointer-events-none select-none"
                    />
                  </div>
                </div>
              ))}

              {/* Duplicate set for seamless loop */}
              {[
                { src: reactIcon, alt: "React" },
                { src: viteIcon, alt: "Vite" },
                { src: tailwindIcon, alt: "Tailwind CSS" },
                { src: nodeIcon, alt: "Node.js" },
                { src: expressIcon, alt: "Express" },
                { src: mysqlIcon, alt: "MySQL" },
                { src: redisIcon, alt: "Redis" },
                { src: bullIcon, alt: "Bull" },
                { src: stripeIcon, alt: "Stripe" },
                { src: mapBoxIcon, alt: "MapBox" },
              ].map((tech, index) => (
                <div className="tech-logo" key={`duplicate-${index}`}>
                  <div className="tech-logo-container">
                    <img
                      src={tech.src || "/placeholder.svg"}
                      alt={tech.alt}
                      className="h-24 w-24 sm:h-28 sm:w-28 object-contain pointer-events-none select-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            OFS is located at 1 Washington Sq, San Jose, California, United States, 95192 and delivers within a 25 mile
            radius.
          </p>
          <div className="mt-4 flex justify-center">
            <a href="https://github.com/mikeshuh/OFS" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AboutPage
