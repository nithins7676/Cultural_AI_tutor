export const storyBank: Record<string, any> = {
  tamil: {
    title: "The Festival of Pongal: A Journey Through Tamil Heritage",
    description: "Join Meera as she celebrates Pongal and discovers the mathematics, science, history, and literature woven into Tamil culture.",
    culturalQuote: {
      text: "யாமறிந்த மொழிகளிலே தமிழ்மொழி போல் இனிதாவது எங்கும் காணோம்",
      attribution: "Bharathiyar - Among all languages we know, none is as sweet as Tamil"
    },
    segments: [
      {
        subject: "math",
        title: "The Geometry of Kolam",
        content: "Meera watched her grandmother draw the intricate kolam pattern outside their home for Thaipusam celebrations. 'Paati, how do you make it so perfect?' she asked. Her grandmother smiled, 'Each kolam follows mathematical principles, dear child. See this square pattern? If each side is 4 meters, what would be the area?' As Meera calculated, she realized that the kolam's beauty came from precise geometric relationships - the same mathematics that ancient Tamil architects used to build magnificent temples.",
        concept: "Area calculation and geometric patterns",
        questions: {
          multipleChoice: {
            question: "If a square kolam pattern has sides of 4 meters each, what is its area?",
            options: ["12 square meters", "16 square meters", "20 square meters", "8 square meters"],
            correct: 1
          },
          openEnded: {
            question: "How do you think mathematics helps preserve cultural traditions like kolam-making?",
            sampleAnswer: "Mathematics helps preserve kolam traditions by providing precise geometric principles that ensure patterns are symmetrical and aesthetically pleasing. The mathematical relationships in kolam designs have been passed down through generations, maintaining cultural continuity while demonstrating the practical application of geometry in daily life."
          }
        },
        feedback: {
          correct: "Excellent! Just like the perfect kolam patterns that grace Tamil homes, your calculation shows the mathematical beauty embedded in our cultural traditions.",
          encouragement: "Great thinking! Mathematics and culture are beautifully intertwined in Tamil traditions like kolam-making."
        }
      },
      {
        subject: "science",
        title: "The Science of Pongal Cooking",
        content: "In the kitchen, Meera's mother was preparing the traditional Pongal dish. 'Amma, why does the rice and milk bubble up exactly when it's ready?' Meera asked. Her mother explained, 'It's all about temperature and pressure, Meera. When we heat the mixture, the water turns to steam, creating pressure that makes it rise. This is the same scientific principle our ancestors understood when they celebrated the first rice harvest.' The bubbling pot was not just cooking food, but demonstrating the physics of heat transfer and phase changes.",
        concept: "Heat transfer and states of matter",
        questions: {
          multipleChoice: {
            question: "What causes the Pongal mixture to bubble and rise while cooking?",
            options: ["Magic from the harvest gods", "Steam pressure from heated water", "The rice expanding", "Adding sugar"],
            correct: 1
          },
          openEnded: {
            question: "How do traditional cooking methods demonstrate scientific principles?",
            sampleAnswer: "Traditional cooking methods like making Pongal demonstrate principles of thermodynamics, heat transfer, and phase changes. The bubbling action shows how heat energy converts water to steam, creating pressure. Ancient cooking techniques often incorporated scientific understanding passed down through generations, showing how our ancestors intuitively understood physics and chemistry."
          }
        },
        feedback: {
          correct: "Perfect! Like the traditional Pongal pot that signals the harvest celebration, you've mastered the science behind this cultural practice.",
          encouragement: "Wonderful observation! Our traditional practices often contain deep scientific wisdom passed down through generations."
        }
      },
      {
        subject: "history",
        title: "The Legacy of Raja Raja Chola",
        content: "As the family visited the nearby Chola temple during the Pongal festival, Meera's grandfather shared stories of Raja Raja Chola I, who ruled over 1000 years ago. 'This temple was built during his reign,' he said, pointing to the towering vimana. 'Raja Raja Chola not only built magnificent temples but also created one of the world's most powerful naval forces. His empire stretched from Sri Lanka to the Maldives, making Tamil culture and language flourish across the seas. The very festival we celebrate today has roots in the agricultural prosperity his kingdom enjoyed.'",
        concept: "Chola Empire and medieval South Indian history",
        questions: {
          multipleChoice: {
            question: "What was one of Raja Raja Chola I's major achievements?",
            options: ["Building powerful naval forces", "Inventing the kolam", "Creating the Tamil calendar", "Writing Tamil poetry"],
            correct: 0
          },
          openEnded: {
            question: "How did the Chola Empire contribute to spreading Tamil culture beyond India?",
            sampleAnswer: "The Chola Empire, under rulers like Raja Raja Chola I, used their powerful navy to establish trade routes and cultural connections across Southeast Asia. They built temples, promoted Tamil language and literature, and established administrative systems in regions like Sri Lanka, Malaysia, and Indonesia. This maritime expansion helped preserve and spread Tamil culture, art, and religious practices throughout the Indian Ocean region."
          }
        },
        feedback: {
          correct: "Excellent! Like the mighty Chola naval expeditions that spread Tamil culture across the seas, your knowledge honors our heritage.",
          encouragement: "Great insight! The Chola Empire's maritime achievements showcase how Tamil culture reached far beyond our homeland."
        }
      },
      {
        subject: "literature",
        title: "Wisdom from Thiruvalluvar",
        content: "That evening, as the family gathered for Pongal celebrations, Meera's uncle recited a verse from the Thirukkural: 'கற்க கசடறக் கற்பவை கற்றபின் நிற்க அதற்குத் தக.' Meera asked what it meant, and her uncle translated: 'Learn perfectly without flaw; and having learned, practice what you have learned steadfastly.' He explained that Thiruvalluvar, the great Tamil poet and philosopher, wrote 1,330 couplets covering ethics, political and economic matters, and love. 'This wisdom,' he said, 'has guided Tamil society for over 2000 years, teaching us values that we celebrate during festivals like Pongal.'",
        concept: "Classical Tamil literature and moral philosophy",
        questions: {
          multipleChoice: {
            question: "How many couplets are there in the Thirukkural?",
            options: ["1,000", "1,330", "1,500", "2,000"],
            correct: 1
          },
          openEnded: {
            question: "How do classical Tamil literary works like Thirukkural continue to influence modern Tamil culture?",
            sampleAnswer: "Classical Tamil works like Thirukkural continue to influence modern Tamil culture by providing timeless moral and ethical guidance. The couplets are quoted in daily conversations, taught in schools, and referenced in literature and films. The universal values of truth, compassion, and righteousness found in these works shape Tamil identity and are celebrated during cultural festivals, ensuring that ancient wisdom remains relevant in contemporary society."
          }
        },
        feedback: {
          correct: "Wonderful! Like the timeless wisdom of Thiruvalluvar that guides Tamil hearts, your understanding reflects deep cultural appreciation.",
          encouragement: "Beautiful reflection! Classical Tamil literature continues to inspire and guide us through its profound wisdom."
        }
      }
    ],
    math: {
      algebra_basics: {
        title: "Algebra in Tamil Culture: The Language of Patterns",
        description: "Discover how algebra connects to Tamil traditions through patterns, festivals, and daily life.",
        culturalQuote: {
          text: "Mathematics is the language of the universe, and in Tamil culture, it's the language of our ancestors' wisdom.",
          attribution: "Ancient Tamil Mathematician"
        },
        segments: [
          {
            subject: "math",
            title: "Introduction to Algebraic Thinking",
            content: `Welcome to the fascinating world of algebra in Tamil culture! Algebra isn't just about solving equations—it's about understanding patterns and relationships that our Tamil ancestors discovered through careful observation of nature and daily life. In Tamil traditions, we see algebraic thinking everywhere: from the rhythmic patterns of kolam designs to the mathematical precision of temple architecture. Our ancestors used algebraic concepts to plan harvest festivals, calculate crop yields, and create beautiful geometric art. This ancient wisdom shows us that algebra is not just a modern invention—it's a way of thinking that has been part of Tamil culture for thousands of years.`,
            concept: "Understanding patterns and relationships in Tamil cultural practices",
            questions: {
              multipleChoice: {
                question: "How did Tamil ancestors use algebraic thinking in their daily lives?",
                options: ['Only for temple construction', 'For planning festivals and calculating crop yields', 'Only for artistic designs', 'They didn\'t use algebra at all'],
                correct: 1
              },
              openEnded: {
                question: "How can understanding algebra help us appreciate Tamil cultural traditions?",
                sampleAnswer: "Understanding algebra helps us see the mathematical beauty in Tamil traditions like kolam patterns, temple architecture, and festival planning, showing how our ancestors were brilliant mathematicians."
              }
            },
            feedback: {
              correct: "Excellent! You understand how algebra connects to Tamil cultural practices.",
              encouragement: "Great thinking! You're seeing the mathematical wisdom in Tamil traditions."
            }
          },
          {
            subject: "math",
            title: "Algebraic Patterns in Traditional Art",
            content: `Tamil traditional art is a living example of algebraic patterns in action! When our grandmothers create kolam designs, they're actually practicing algebra. Each kolam starts with a grid of dots, and the patterns follow mathematical rules that create beautiful symmetry. The process involves understanding variables (the number of dots), constants (the basic patterns), and relationships (how patterns repeat and transform). These designs aren't just decorative—they're mathematical expressions of Tamil cultural values like harmony, balance, and community. The kolam patterns also teach us about sequences, where each line follows a mathematical rule to create the overall design. This shows how algebra helps us create beauty while preserving cultural traditions.`,
            concept: "Recognizing algebraic patterns in Tamil traditional art forms",
            questions: {
              multipleChoice: {
                question: "What mathematical concepts are demonstrated in kolam designs?",
                options: ['Only basic counting', 'Symmetry, patterns, and sequences', 'Only geometry', 'Only arithmetic'],
                correct: 1
              },
              openEnded: {
                question: "How do kolam patterns reflect Tamil cultural values?",
                sampleAnswer: "Kolam patterns reflect Tamil values through their symmetry (harmony), mathematical precision (discipline), and community aspect (shared cultural practice)."
              }
            },
            feedback: {
              correct: "Perfect! You see the mathematical beauty in Tamil traditional art.",
              encouragement: "Wonderful observation! You're connecting math to cultural expression."
            }
          },
          {
            subject: "math",
            title: "Algebra in Festival Planning",
            content: `Tamil festivals are perfect examples of algebra in real-world applications! When our ancestors planned Pongal celebrations, they used algebraic thinking to solve practical problems. For example, if a village had 50 families and each family needed 2 kilograms of rice for the festival, they would calculate: 50 families × 2 kg = 100 kg total rice needed. This is algebra in action! They also used algebraic thinking to plan the timing of festivals based on agricultural cycles, calculate the amount of materials needed for decorations, and organize community activities. The beauty of this approach is that it combines mathematical precision with cultural wisdom, showing how algebra helps us maintain traditions while solving practical problems.`,
            concept: "Applying algebraic thinking to solve real-world cultural problems",
            questions: {
              multipleChoice: {
                question: "How did Tamil ancestors use algebra in festival planning?",
                options: ['Only for decoration calculations', 'For calculating food needs, timing, and materials', 'Only for religious purposes', 'They didn\'t use algebra'],
                correct: 1
              },
              openEnded: {
                question: "How does understanding algebra help us preserve Tamil festival traditions?",
                sampleAnswer: "Understanding algebra helps us calculate resources needed for festivals, plan activities efficiently, and ensure traditions continue with mathematical precision."
              }
            },
            feedback: {
              correct: "Excellent! You understand the practical applications of algebra in Tamil culture.",
              encouragement: "Great insight! You're seeing how math preserves cultural traditions."
            }
          },
          {
            subject: "math",
            title: "Modern Applications of Algebraic Wisdom",
            content: `Today, the algebraic wisdom of Tamil ancestors continues to inspire modern applications! Our traditional understanding of patterns and relationships has found new expression in computer programming, where algorithms follow similar logical structures to kolam patterns. Tamil mathematicians are now applying ancient algebraic concepts to modern technology, from designing efficient computer networks to creating artificial intelligence systems. The principles of symmetry and balance from traditional art are being used in modern architecture and design. This shows that Tamil algebraic thinking is not just historical—it's a living tradition that continues to evolve and contribute to modern innovation while preserving our cultural heritage.`,
            concept: "Connecting traditional algebraic wisdom to modern technology and innovation",
            questions: {
              multipleChoice: {
                question: "How is Tamil algebraic wisdom being applied in modern times?",
                options: ['Only in traditional art', 'In computer programming, AI, and modern design', 'Only in mathematics education', 'It\'s not being used today'],
                correct: 1
              },
              openEnded: {
                question: "How can we ensure Tamil algebraic wisdom continues to inspire future generations?",
                sampleAnswer: "We can preserve this wisdom by teaching it in schools, documenting traditional practices, and showing how ancient concepts apply to modern problems."
              }
            },
            feedback: {
              correct: "Perfect! You understand how Tamil wisdom bridges past and present.",
              encouragement: "Excellent thinking! You're seeing the timeless value of Tamil mathematical wisdom."
            }
          }
        ]
      },
      geometry: {
        title: "Geometry in Tamil Culture: The Art of Sacred Shapes",
        description: "Explore how geometric principles are embedded in Tamil temple architecture, art, and daily life.",
        culturalQuote: {
          text: "In every curve and angle of our temples, geometry speaks the language of the divine.",
          attribution: "Tamil Temple Architect"
        },
        segments: [
          {
            subject: "math",
            title: "Sacred Geometry in Temple Design",
            content: `Tamil temple architecture is a masterpiece of geometric principles! Every temple is built following precise geometric rules that our ancestors discovered through generations of observation and spiritual practice. The temple layout follows the mandala pattern, a sacred geometric design that represents the universe. The gopuram (tower) uses perfect proportions based on the golden ratio, creating a sense of harmony and beauty. The temple's orientation follows geometric principles to align with cosmic forces. This sacred geometry isn't just about aesthetics—it's about creating spaces that connect the physical world with the spiritual realm. Our ancestors understood that geometry is the language of the universe, and they used it to build structures that inspire awe and devotion.`,
            concept: "Understanding how geometric principles create sacred spaces in Tamil culture",
            questions: {
              multipleChoice: {
                question: "What geometric principle is used in Tamil temple design?",
                options: ['Only basic shapes', 'The mandala pattern and golden ratio', 'Only straight lines', 'Only circles'],
                correct: 1
              },
              openEnded: {
                question: "How does sacred geometry connect the physical and spiritual in Tamil temples?",
                sampleAnswer: "Sacred geometry creates harmony between physical space and spiritual meaning, using mathematical precision to connect human experience with divine presence."
              }
            },
            feedback: {
              correct: "Excellent! You understand the spiritual significance of geometry in Tamil culture.",
              encouragement: "Great insight! You're seeing the deeper meaning behind geometric design."
            }
          },
          {
            subject: "math",
            title: "Geometric Patterns in Daily Life",
            content: `Geometry surrounds us in Tamil daily life! From the circular kolam patterns that welcome guests to the rectangular rice fields that feed our communities, geometric shapes are everywhere. Our traditional cooking vessels use specific geometric forms for optimal heat distribution. The way we arrange items in our homes follows geometric principles for harmony and efficiency. Even our traditional clothing uses geometric patterns that reflect cultural values. These everyday applications show that geometry isn't just an abstract concept—it's a practical tool that helps us live better lives while preserving our cultural traditions. Our ancestors understood that geometric principles create order, beauty, and functionality in everything we do.`,
            concept: "Recognizing geometric principles in Tamil daily practices and traditions",
            questions: {
              multipleChoice: {
                question: "How do Tamil people use geometry in daily life?",
                options: ['Only in art', 'In cooking, farming, home arrangement, and clothing', 'Only in construction', 'They don\'t use geometry'],
                correct: 1
              },
              openEnded: {
                question: "How do geometric patterns in daily life reflect Tamil cultural values?",
                sampleAnswer: "Geometric patterns reflect values like harmony (symmetry), order (regular shapes), and community (shared patterns) in Tamil culture."
              }
            },
            feedback: {
              correct: "Perfect! You see geometry as a practical part of Tamil culture.",
              encouragement: "Wonderful observation! You're connecting geometry to cultural values."
            }
          },
          {
            subject: "math",
            title: "The Mathematics of Traditional Crafts",
            content: `Tamil traditional crafts are mathematical masterpieces! When artisans create bronze statues, they use geometric principles to ensure perfect proportions. The lost-wax casting process involves complex geometric calculations to create hollow structures. Traditional weaving patterns follow geometric sequences that create beautiful designs. Even the making of traditional musical instruments requires precise geometric measurements for perfect sound. These crafts show how geometry combines with artistic expression to create objects of both beauty and function. Our ancestors were master mathematicians who used geometric principles to create works of art that have lasted for generations.`,
            concept: "Understanding how geometric principles enhance traditional Tamil crafts",
            questions: {
              multipleChoice: {
                question: "How do Tamil artisans use geometry in their crafts?",
                options: ['Only for decoration', 'For proportions, measurements, and creating functional art', 'Only for basic shapes', 'They don\'t use geometry'],
                correct: 1
              },
              openEnded: {
                question: "How do geometric principles help preserve Tamil traditional crafts?",
                sampleAnswer: "Geometric principles ensure consistency, quality, and beauty in traditional crafts, helping them maintain their cultural significance across generations."
              }
            },
            feedback: {
              correct: "Excellent! You understand the mathematical precision in Tamil crafts.",
              encouragement: "Great insight! You're seeing the mathematical beauty in traditional art."
            }
          },
          {
            subject: "math",
            title: "Geometry in Modern Tamil Innovation",
            content: `Today, Tamil geometric wisdom is inspiring modern innovation! Our traditional understanding of sacred geometry is being applied to modern architecture, creating buildings that are both beautiful and functional. Tamil geometric patterns are being used in computer graphics and digital design. The principles of proportion and harmony from traditional crafts are being applied to modern product design. Even in medical imaging and engineering, Tamil geometric concepts are finding new applications. This shows that our geometric heritage is not just historical—it's a living tradition that continues to inspire innovation while preserving our cultural identity.`,
            concept: "Connecting traditional geometric wisdom to modern innovation and technology",
            questions: {
              multipleChoice: {
                question: "How is Tamil geometric wisdom being used in modern times?",
                options: ['Only in traditional art', 'In architecture, digital design, and modern technology', 'Only in mathematics education', 'It\'s not being used today'],
                correct: 1
              },
              openEnded: {
                question: "How can we ensure Tamil geometric wisdom continues to inspire future innovation?",
                sampleAnswer: "We can preserve this wisdom by documenting traditional practices, teaching geometric principles in schools, and showing their modern applications."
              }
            },
            feedback: {
              correct: "Perfect! You understand how Tamil geometry bridges tradition and innovation.",
              encouragement: "Excellent thinking! You're seeing the timeless value of geometric wisdom."
            }
          }
        ]
      }
    },
    science: {
      energy_and_heat: {
        title: "Energy and Heat in Tamil Culture: The Science of Life",
        description: "Discover how energy and heat principles are embedded in Tamil cooking, rituals, and daily practices.",
        culturalQuote: {
          text: "Fire is not just heat—it's the energy that transforms raw ingredients into the essence of life.",
          attribution: "Tamil Traditional Cook"
        },
        segments: [
          {
            subject: "science",
            title: "The Science of Traditional Cooking",
            content: `Tamil traditional cooking is a perfect laboratory for understanding energy and heat! When we cook on traditional clay stoves, we're witnessing the transfer of heat energy from fire to food. The clay pot acts as a conductor, distributing heat evenly to cook our rice and vegetables. The steam that rises when we cook is water changing from liquid to gas due to heat energy. Our ancestors understood these principles intuitively and used them to create cooking methods that are both efficient and healthy. The traditional pressure cooking technique uses steam pressure to cook food faster, showing sophisticated understanding of how heat and pressure work together. This ancient wisdom demonstrates that Tamil cooking is not just about taste—it's about understanding the science of energy transformation.`,
            concept: "Understanding heat energy transfer in Tamil traditional cooking methods",
            questions: {
              multipleChoice: {
                question: "How do Tamil traditional cooking methods demonstrate energy principles?",
                options: ['Only through fire', 'Through heat transfer, steam formation, and pressure cooking', 'Only through boiling', 'They don\'t demonstrate energy principles'],
                correct: 1
              },
              openEnded: {
                question: "How does understanding energy principles help us appreciate Tamil cooking traditions?",
                sampleAnswer: "Understanding energy principles helps us see the scientific wisdom in traditional cooking methods and appreciate how our ancestors mastered heat and energy transfer."
              }
            },
            feedback: {
              correct: "Excellent! You understand the scientific principles in Tamil cooking.",
              encouragement: "Great observation! You're seeing the science behind traditional practices."
            }
          },
          {
            subject: "science",
            title: "Heat and Energy in Cultural Rituals",
            content: `Tamil cultural rituals beautifully demonstrate energy and heat principles! During temple ceremonies, the sacred fire (agni) represents the transformation of energy from one form to another. The heat from the fire purifies offerings and creates a sacred atmosphere. In traditional medicine, heat therapy is used to treat various ailments, showing understanding of how heat affects the human body. Even the simple act of lighting oil lamps demonstrates the conversion of chemical energy in oil to light and heat energy. These rituals show that our ancestors understood energy principles and used them to create meaningful cultural practices that connect the physical and spiritual worlds.`,
            concept: "Recognizing energy and heat principles in Tamil cultural and spiritual practices",
            questions: {
              multipleChoice: {
                question: "How do Tamil rituals demonstrate energy and heat principles?",
                options: ['Only through fire ceremonies', 'Through sacred fires, heat therapy, and energy conversion', 'Only through lighting lamps', 'They don\'t demonstrate energy principles'],
                correct: 1
              },
              openEnded: {
                question: "How do energy principles connect the physical and spiritual in Tamil rituals?",
                sampleAnswer: "Energy principles connect physical and spiritual realms through the transformation of matter and energy, creating sacred spaces and meaningful experiences."
              }
            },
            feedback: {
              correct: "Perfect! You understand the spiritual significance of energy in Tamil culture.",
              encouragement: "Wonderful insight! You're seeing the deeper meaning of energy transformation."
            }
          },
          {
            subject: "science",
            title: "Traditional Energy Conservation",
            content: `Tamil ancestors were masters of energy conservation! Traditional homes were designed to maximize natural light and ventilation, reducing the need for artificial energy. The thick walls of traditional houses provided natural insulation, keeping homes cool in summer and warm in winter. Traditional farming methods used natural energy cycles, from solar energy for crop growth to animal energy for plowing. Even the timing of daily activities was based on natural energy patterns, with work done during daylight hours and rest during cooler periods. This sustainable approach shows sophisticated understanding of energy conservation and environmental harmony.`,
            concept: "Understanding traditional Tamil approaches to energy conservation and sustainability",
            questions: {
              multipleChoice: {
                question: "How did Tamil ancestors practice energy conservation?",
                options: ['Only by using less fire', 'Through natural lighting, insulation, and sustainable farming', 'Only by working less', 'They didn\'t practice energy conservation'],
                correct: 1
              },
              openEnded: {
                question: "How can traditional Tamil energy practices inspire modern sustainability?",
                sampleAnswer: "Traditional practices can inspire modern sustainability by showing how to work with natural energy cycles and minimize artificial energy use."
              }
            },
            feedback: {
              correct: "Excellent! You understand traditional Tamil wisdom about energy conservation.",
              encouragement: "Great thinking! You're seeing the relevance of traditional practices today."
            }
          },
          {
            subject: "science",
            title: "Modern Applications of Energy Wisdom",
            content: `Today, Tamil energy wisdom is inspiring modern sustainable practices! Traditional cooking methods are being adapted for modern energy-efficient kitchens. The principles of natural ventilation and insulation from traditional architecture are being applied to green building design. Traditional farming techniques that work with natural energy cycles are inspiring modern organic farming methods. Even the concept of energy conservation from traditional daily practices is being applied to modern lifestyle choices. This shows that Tamil energy wisdom is not just historical—it's a living tradition that continues to guide us toward sustainable living.`,
            concept: "Connecting traditional Tamil energy wisdom to modern sustainable practices",
            questions: {
              multipleChoice: {
                question: "How is Tamil energy wisdom being applied in modern times?",
                options: ['Only in traditional cooking', 'In green building, organic farming, and sustainable living', 'Only in energy conservation', 'It\'s not being applied today'],
                correct: 1
              },
              openEnded: {
                question: "How can we preserve and promote Tamil energy wisdom for future generations?",
                sampleAnswer: "We can preserve this wisdom by documenting traditional practices, teaching energy principles in schools, and showing their modern applications."
              }
            },
            feedback: {
              correct: "Perfect! You understand how Tamil wisdom guides modern sustainability.",
              encouragement: "Excellent insight! You're seeing the timeless value of energy wisdom."
            }
          }
        ]
      }
    }
  },
  hindi: {
    title: "Diwali: The Festival of Lights and Learning",
    description: "Experience Diwali through Arjun's eyes as he discovers the mathematical patterns in rangoli, the science of diyas, the history of ancient India, and the literature of celebration.",
    culturalQuote: {
      text: "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः",
      attribution: "Sanskrit Prayer - May all beings be happy and free from illness"
    },
    segments: [
      {
        subject: "math",
        title: "Rangoli Patterns and Symmetry",
        content: "Arjun watched his mother create a beautiful rangoli pattern for Diwali. The design had 8 petals arranged in perfect symmetry around a central circle. 'Beta, do you know why rangoli looks so beautiful?' his mother asked. 'It's because of mathematical symmetry. If I divide this pattern into equal parts, each section mirrors the others perfectly.' She showed him how the 8 petals divided the circle into equal angles. 'Each angle is 360 divided by 8, which equals 45 degrees,' she explained, connecting ancient art with mathematical precision.",
        concept: "Angles, symmetry, and division",
        questions: {
          multipleChoice: {
            question: "If a rangoli pattern has 8 equal petals around a circle, what is the angle of each section?",
            options: ["30 degrees", "45 degrees", "60 degrees", "90 degrees"],
            correct: 1
          },
          openEnded: {
            question: "How does mathematical symmetry make traditional art forms like rangoli more appealing?",
            sampleAnswer: "Mathematical symmetry in rangoli creates visual harmony and balance that naturally appeals to the human eye. The equal distribution of patterns, precise angles, and geometric repetition create a sense of order and beauty. This mathematical foundation allows artists to create complex designs that are both aesthetically pleasing and culturally meaningful, showing how mathematics and art complement each other in Indian traditions."
          }
        },
        feedback: {
          correct: "Excellent! Like the perfect rangoli that welcomes prosperity during Diwali, your calculation brings mathematical beauty to life.",
          encouragement: "Great thinking! Mathematics and traditional art create beautiful harmony in our cultural practices."
        }
      },
      {
        subject: "science",
        title: "The Science of Diya Flames",
        content: "As evening approached, Arjun helped light the diyas around their home. 'Papa, why does the diya flame always point upward?' he asked. His father explained, 'It's because of convection, beta. When the oil burns, it heats the air above it. Hot air is lighter than cold air, so it rises upward, carrying the flame with it. This same principle helps birds soar in the sky using thermal currents.' As they lit each diya, Arjun marveled at how the simple clay lamps demonstrated the physics of heat, combustion, and fluid dynamics.",
        concept: "Convection, combustion, and heat transfer",
        questions: {
          multipleChoice: {
            question: "Why do diya flames always point upward?",
            options: ["Because of wind", "Due to convection currents", "Oil pulls it up", "Spiritual energy"],
            correct: 1
          },
          openEnded: {
            question: "What scientific principles can we observe in traditional Diwali celebrations?",
            sampleAnswer: "Diwali celebrations demonstrate many scientific principles: combustion in diyas shows chemical reactions, convection explains flame behavior, optics explains how fireworks create colors, and acoustics explains sound in celebrations. The metallurgy in making brass diyas, chemistry in creating rangoli colors, and physics in lighting effects all showcase how traditional festivals incorporate scientific understanding in meaningful cultural practices."
          }
        },
        feedback: {
          correct: "Perfect! Like the steady diya flame that conquers darkness, your understanding illuminates the science in our traditions.",
          encouragement: "Wonderful observation! Our festivals beautifully demonstrate scientific principles through meaningful traditions."
        }
      },
      {
        subject: "history",
        title: "The Return of Lord Rama",
        content: "While decorating the house, Arjun's grandmother shared the historical significance of Diwali. 'Long ago, in the ancient kingdom of Ayodhya, people celebrated the return of Lord Rama after his 14-year exile. They lit oil lamps to welcome him home after he defeated the demon king Ravana.' She explained how this story, recorded in the Ramayana written by sage Valmiki around 500 BCE, became the foundation for Diwali celebrations. 'This festival connects us to thousands of years of Indian history, from ancient kingdoms to the values of righteousness and truth that still guide us today.'",
        concept: "Ancient Indian history and the Ramayana",
        questions: {
          multipleChoice: {
            question: "Who wrote the ancient epic Ramayana?",
            options: ["Sage Vyasa", "Sage Valmiki", "Kalidasa", "Tulsidas"],
            correct: 1
          },
          openEnded: {
            question: "How do ancient epics like the Ramayana continue to influence modern Indian culture?",
            sampleAnswer: "Ancient epics like the Ramayana continue to influence modern Indian culture by providing moral and ethical frameworks that guide daily life. The stories teach values like duty, loyalty, and righteousness that are celebrated through festivals, retold in regional literature, adapted in modern media, and used to teach children about good versus evil. These timeless narratives connect contemporary Indians to their historical roots while providing relevant lessons for modern challenges."
          }
        },
        feedback: {
          correct: "Excellent! Like the eternal light of Rama's victory over evil, your knowledge honors our ancient heritage.",
          encouragement: "Beautiful understanding! Ancient stories continue to illuminate our path with timeless wisdom."
        }
      },
      {
        subject: "literature",
        title: "Poetry of Celebration",
        content: "As the family gathered for the evening prayers, Arjun's aunt recited a beautiful Sanskrit shloka: 'दीपावली की शुभ बेला में, घर घर में उजियारा। सुख, शांति और समृद्धि का, यह पावन त्योहारा।' (In the auspicious time of Diwali, every home is illuminated. This sacred festival brings happiness, peace, and prosperity.) She explained how Indian literature is rich with poetry celebrating festivals, seasons, and life's joys. 'From ancient Sanskrit verses to modern Hindi poetry, our literature captures the essence of our celebrations and connects our hearts across generations.'",
        concept: "Sanskrit and Hindi poetry traditions",
        questions: {
          multipleChoice: {
            question: "What language is the traditional Diwali verse recited in?",
            options: ["Tamil", "Sanskrit", "Hindi", "Both Sanskrit and Hindi"],
            correct: 3
          },
          openEnded: {
            question: "How does poetry enhance the celebration of cultural festivals?",
            sampleAnswer: "Poetry enhances cultural festivals by expressing emotions and meanings that transcend ordinary language. Through rhythm, metaphor, and imagery, poetry captures the spiritual and emotional essence of celebrations, making them more memorable and meaningful. Festival poetry preserves cultural values, connects generations through shared recitations, and adds artistic beauty to celebrations, creating deeper emotional connections to traditions and community."
          }
        },
        feedback: {
          correct: "Wonderful! Like the melodious verses that make Diwali celebrations more beautiful, your appreciation for literature shines bright.",
          encouragement: "Great insight! Poetry adds soul and meaning to our cultural celebrations, making them truly memorable."
        }
      }
    ]
  },
  bengali: {
    title: "Durga Puja: The Grand Celebration of Bengal",
    description: "Walk with Priya through the vibrant Durga Puja celebrations and discover the mathematics in pandal architecture, science in idol-making, historical significance of the goddess, and literary beauty of Bengali poetry.",
    culturalQuote: {
      text: "যে জন বঙ্গেতে জন্মি হিংসে বঙ্গবাণী, সে জন কাহার জন্ম নির্ণয় ন জানি",
      attribution: "Abdul Hakim - One who is born in Bengal but despises Bengali language, I don't know whose child they are"
    },
    segments: [
      {
        subject: "math",
        title: "Pandal Architecture and Proportions",
        content: "Priya stood amazed before the magnificent Durga Puja pandal in her neighborhood. The artist uncle explained, 'Priya, see how beautiful this pandal looks? It follows the golden ratio - a mathematical proportion found in nature and art.' He showed her how the height and width were in a 1.618:1 ratio. 'If the pandal's width is 10 meters, its height should be 16.18 meters to achieve perfect harmony.' This same mathematical principle, he explained, was used in ancient Bengali temple architecture and creates the aesthetic appeal that makes people stop and admire the pandal.",
        concept: "Ratios, proportions, and architectural mathematics",
        questions: {
          multipleChoice: {
            question: "If a pandal follows the golden ratio and has a width of 8 meters, approximately what should its height be?",
            options: ["10.5 meters", "12.9 meters", "14.2 meters", "16.0 meters"],
            correct: 1
          },
          openEnded: {
            question: "How do mathematical principles like the golden ratio enhance the beauty of cultural architecture?",
            sampleAnswer: "Mathematical principles like the golden ratio enhance cultural architecture by creating naturally pleasing proportions that appeal to human perception. This ratio, found throughout nature, creates a sense of harmony and balance that makes structures aesthetically satisfying. In Bengali pandal architecture, these proportions ensure that the temporary structures are not only functional but also beautiful, creating spaces that enhance the spiritual and cultural experience of Durga Puja celebrations."
          }
        },
        feedback: {
          correct: "Excellent! Like the perfectly proportioned pandals that grace Durga Puja, your mathematical understanding creates harmony and beauty.",
          encouragement: "Great calculation! Mathematics truly brings artistic beauty to our cultural architectural traditions."
        }
      },
      {
        subject: "science",
        title: "The Art and Science of Idol Making",
        content: "At the sculptor's workshop, Priya watched the kumhar (potter) craft Durga's idol from clay. 'Didi, how does the clay become so strong and beautiful?' she asked the sculptor. 'It's a beautiful combination of chemistry and physics, Priya. We mix specific ratios of clay, straw, and water. When fired, the heat causes chemical changes that make the clay hard. The straw adds tensile strength, preventing cracks.' The sculptor showed her how they use natural pigments - turmeric for yellow, vermillion for red - each color coming from different chemical compounds that have been used in Bengali art for centuries.",
        concept: "Chemistry of materials and natural pigments",
        questions: {
          multipleChoice: {
            question: "What happens to clay during the firing process?",
            options: ["It becomes softer", "Chemical changes make it harder", "It melts completely", "Only the color changes"],
            correct: 1
          },
          openEnded: {
            question: "How do traditional art forms like idol-making demonstrate scientific understanding?",
            sampleAnswer: "Traditional idol-making demonstrates scientific understanding through material science (knowing clay properties), chemistry (using natural pigments and understanding their reactions), physics (understanding structural support and firing temperatures), and engineering (creating stable, proportioned sculptures). Bengali artisans have passed down this scientific knowledge through generations, showing how traditional crafts incorporate sophisticated understanding of materials, chemical processes, and physical principles."
          }
        },
        feedback: {
          correct: "Perfect! Like the skilled artisans who transform clay into divine beauty, your understanding bridges science and tradition.",
          encouragement: "Wonderful insight! Traditional arts beautifully demonstrate how science and culture work together."
        }
      },
      {
        subject: "history",
        title: "The Historical Significance of Durga",
        content: "During the evening aarti, Priya's grandfather shared the historical context of Durga Puja. 'Priya, did you know that Durga Puja became popular in Bengal during the British period?' He explained how wealthy zamindars like Raja Nabakrishna Deb started grand celebrations in the 18th century. 'But the goddess Durga herself represents something deeper - the victory of good over evil, knowledge over ignorance. During our independence struggle, Durga became a symbol of Shakti, the divine feminine power that inspired freedom fighters. Even today, this festival unites millions of Bengalis worldwide, connecting us to our roots and shared history.'",
        concept: "Colonial period Bengal and cultural nationalism",
        questions: {
          multipleChoice: {
            question: "During which period did Durga Puja become a grand public celebration in Bengal?",
            options: ["Ancient period", "Medieval period", "British colonial period", "Post-independence"],
            correct: 2
          },
          openEnded: {
            question: "How did Durga Puja evolve from religious worship to a symbol of cultural identity?",
            sampleAnswer: "Durga Puja evolved from individual religious worship to a symbol of cultural identity through historical circumstances. During British rule, wealthy Bengali zamindars transformed private worship into grand public celebrations that brought communities together. The goddess Durga, representing divine feminine power, became a metaphor for resistance against oppression. This festival fostered Bengali unity, cultural pride, and national consciousness, evolving into a celebration that transcends religious boundaries and represents Bengali cultural identity worldwide."
          }
        },
        feedback: {
          correct: "Excellent! Like the enduring strength of Ma Durga, your understanding of our cultural history stands strong through time.",
          encouragement: "Great insight! Understanding how our festivals evolved helps us appreciate their deeper cultural significance."
        }
      },
      {
        subject: "literature",
        title: "Rabindranath Tagore's Autumn Songs",
        content: "As the leaves turned golden during Sharad (autumn), Priya's mother recited Rabindranath Tagore's famous poem: 'আজি ধানের ক্ষেতে রৌদ্রছায়ায় লুকোচুরি খেলা।' (Today in the paddy fields, sunlight and shadows play hide and seek.) She explained how Tagore, Bengal's greatest poet and Nobel laureate, captured the essence of autumn and Durga Puja in his verses. 'Tagore's poetry doesn't just describe the season, Priya. It captures the emotions, the anticipation, the joy of homecoming that every Bengali feels during Durga Puja. His words become our feelings.' Through literature, the festival became more than celebration - it became an emotional experience connecting all Bengalis.",
        concept: "Bengali literature and Rabindranath Tagore",
        questions: {
          multipleChoice: {
            question: "For what achievement is Rabindranath Tagore most internationally famous?",
            options: ["Writing the national anthem", "Winning the Nobel Prize in Literature", "Founding a university", "Painting"],
            correct: 1
          },
          openEnded: {
            question: "How does Tagore's poetry enhance the emotional experience of Bengali festivals?",
            sampleAnswer: "Tagore's poetry enhances Bengali festivals by capturing and expressing the deep emotions associated with cultural celebrations. His verses articulate feelings of nostalgia, joy, spiritual connection, and cultural belonging that people experience but might struggle to express. Through beautiful imagery and rhythm, his poetry becomes the voice of collective emotion, helping people connect more deeply with their cultural traditions and creating shared emotional experiences that strengthen community bonds during festivals like Durga Puja."
          }
        },
        feedback: {
          correct: "Wonderful! Like Tagore's immortal verses that capture Bengali hearts, your appreciation for literature enriches cultural understanding.",
          encouragement: "Beautiful reflection! Poetry truly gives voice to the emotions that make our cultural celebrations so meaningful."
        }
      }
    ]
  }
};
