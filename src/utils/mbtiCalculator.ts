
type MBTIQuestion = {
  id: number;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  optionA: string; // Maps to the first letter (E, S, T, J)
  optionB: string; // Maps to the second letter (I, N, F, P)
};

type MBTIAnswer = {
  questionId: number;
  answer: 'A' | 'B';
};

export const mbtiQuestions: MBTIQuestion[] = [
  {
    id: 1,
    dimension: 'SN',
    optionA: "I can remember the past vividly, I don't take sensory information at face value and I assign my own impressions to information I gather. If I look at a red ball, I might remember how I used to own a similar ball toy back when I was a child.",
    optionB: "My memories of the past aren't well detailed and I take sensory information at face value without assigning personal meanings to it, rather I observe how it is through the 5 senses. If I look at a red ball I will observe it's color, shape, texture etc.",
  },
  {
    id: 2,
    dimension: 'SN',
    optionA: "When trying to predict an outcome I find myself jumping from one possibility to another, I can easily think of alternatives and different outcomes. For me, thinking of more possibilities is more natural than thinking of one most likely answer.",
    optionB: "When trying to predict an outcome I tend to instinctively think of the most likely and probable outcome, without much consideration to other possibilities. For me, thinking of what's most likely is more natural than thinking of more possibilities.",
  },
  {
    id: 3,
    dimension: 'TF',
    optionA: "I am more concerned with maintaining connection and harmony within my environment. I am often aware of many people's needs at once, and seek to find a compromise that will keep as many people content as possible. I would rather keep opinions to myself to maintain peace. If the group is happy, then so am I. I often put more importance on harmony than on voicing my own values; if someone says something that I disagree with, I am often content to let it go and not dwell on it further. I tend to learn the most about other people's emotions in the moment, while I am interacting with them.",
    optionB: "I am more concerned with being authentic and true to my values than with harmony. In group situations, I may focus my attention on the needs of one person or a few people who seem to need it most, and trust more self-sufficient people to take care of themselves. I care very deeply about my values, and if one of them is challenged, I may be compelled to break harmony in order to voice it. If I don't feel confident voicing it, I may feel guilty afterward for not having stood up for what I felt was right. I tend to learn the most about other people's emotions when I am alone and can privately reflect on them.",
  },
  {
    id: 4,
    dimension: 'TF',
    optionA: "I form my logical framework based on external data. If something is backed up by proof and reliable sources, then I believe it. If something does make sense but it's not backed up by proof, I may be dismissive of it. I would rather read a tutorial on how to set up a table rather than waste time trying to figure it out on my own.",
    optionB: "I would rather analyze the subject at hand in depth myself and form my own conclusions about it. For example, if a concept makes perfect sense to me regardless if it's backed up by proof or not, I will believe it. I am most often pulling apart mechanisms to see how they work rather than reading about how it works.",
  },
  {
    id: 5,
    dimension: 'SN',
    optionA: "When out hiking, I'm most likely looking around, observing the trees and the plants around me. I look at the sky, I look at the green shades of the forest, I look at the leaves, I feel the sun on my skin, I look deeper into the texture of the tree barks etc.",
    optionB: "When out hiking, I'm caught in my thoughts, my mind is wandering away on its own. I had been walking on autopilot as I was deep in thought about various subjects such as my interests, the future, the past etc.",
  },
  {
    id: 6,
    dimension: 'SN',
    optionA: "I like to do research on topics that interest me regardless of it benefitting me in some way or not. I like collecting knowledge and trivia on subjects that I'm passionate about. I don't mind if I'm wasting time etc, I simply enjoy it.",
    optionB: "Unless it's of use I prefer not to dive deep into researching subjects as I am not motivated to do such a thing unless I see a viable end result. I like collecting information since it makes me more powerful, but otherwise I don't see the point in it.",
  },
  {
    id: 7,
    dimension: 'TF',
    optionA: "I consider efficiency, control, objective facts/logic, truth, facts, understanding more often than my values, ethics/feelings of others, social harmony",
    optionB: "I consider my values, ethics/other's feelings, social harmony more often than efficiency, control, objective facts/logic, truth, data and understanding",
  },
  {
    id: 8,
    dimension: 'EI',
    optionA: "I am more focused on my inner world. I put my energy into my ideas and am thought oriented. I am more relaxed and in my natural state when I'm inside my head. I feel energized when I'm thinking to myself, talking to myself, planning etc. Brainstorming might be easier for me if I'm left alone to ponder in my mind.",
    optionB: "I am more focused on the external world. I put my energy into the real world, and am more action oriented. I feel most natural when I am influencing my external world through some sort of action whether it's socializing, working etc. Brainstorming might be easier for me if I do it externally with someone else.",
  },
  {
    id: 9,
    dimension: 'SN',
    optionA: "I tend to get lost in my thoughts often, which can cause me to forget about the physical word. This has caused me to miss something directly in front of me before. I can also be more clumsy. It's also easier for me to get lost in ideas and thoughts rather than focusing on what's happening around me and what's concrete. I also don't enjoy doing sports. I can feel awkward in my own body.",
    optionB: "I don't find it challenging to focus on my surroundings, I have good reflexes and I take joy in physical activities such as sports.",
  },
  {
    id: 10,
    dimension: 'JP',
    optionA: "I more often reach sudden realizations that seem to come out of nowhere. These \"epiphanies\" sometimes either predicts what will happen in the outside world, or comes up with detailed solutions to problems on spot. Sometimes it feels like I have a smarter friend inside my head popping in every once in a while and telling me the most likely outcome.",
    optionB: "I usually have to make conscious effort in order to reach an answer, whether it's bouncing between different possibilities, or searching through my collection of past information and insights to see what may work here in this case./I don't relate to realizing answers.",
  },
  {
    id: 11,
    dimension: 'JP',
    optionA: "Acting without thinking first. Example: Saying something the moment it comes to mind, without analyzing it further.",
    optionB: "Thinking without acting. Example: instead of voicing a thought, you might think on it and other things more, missing the chance to vocalize it.",
  },
];

type DimensionCount = {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
};

export function calculateMBTIType(answers: MBTIAnswer[]): string {
  const counts: DimensionCount = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };

  answers.forEach(answer => {
    const question = mbtiQuestions.find(q => q.id === answer.questionId);
    if (!question) return;

    const { dimension } = question;
    
    if (answer.answer === 'A') {
      // First letter of dimension
      if (dimension === 'EI') counts.E += 1;
      if (dimension === 'SN') counts.N += 1;
      if (dimension === 'TF') counts.T += 1;
      if (dimension === 'JP') counts.J += 1;
    } else {
      // Second letter of dimension
      if (dimension === 'EI') counts.I += 1;
      if (dimension === 'SN') counts.S += 1;
      if (dimension === 'TF') counts.F += 1;
      if (dimension === 'JP') counts.P += 1;
    }
  });

  // Calculate each dimension based on which has more counts
  const E_or_I = counts.E >= counts.I ? 'E' : 'I';
  const S_or_N = counts.S >= counts.N ? 'S' : 'N';
  const T_or_F = counts.T >= counts.F ? 'T' : 'F';
  const J_or_P = counts.J >= counts.P ? 'J' : 'P';

  return `${E_or_I}${S_or_N}${T_or_F}${J_or_P}`;
}

export const personalityDescriptions: Record<string, { description: string, careers: string[] }> = {
  'ISTJ': {
    description: 'Responsible, organized, and practical. Values tradition and works systematically.',
    careers: ['Accountant', 'Auditor', 'Project Manager', 'Financial Analyst', 'Systems Administrator']
  },
  'ISFJ': {
    description: 'Caring, loyal, and detail-oriented. Enjoys serving others and maintaining harmony.',
    careers: ['Nurse', 'Teacher', 'Healthcare Administrator', 'Social Worker', 'HR Specialist']
  },
  'INFJ': {
    description: 'Insightful, creative, and principled. Seeks meaning and connection in all things.',
    careers: ['Counselor', 'Psychologist', 'Writer', 'Professor', 'Non-profit Director']
  },
  'INTJ': {
    description: 'Strategic, independent, and innovative. Driven by ideas and skeptical of authority.',
    careers: ['Scientist', 'Software Architect', 'Investment Banker', 'Strategic Planner', 'Management Consultant']
  },
  'ISTP': {
    description: 'Practical problem-solver with exceptional technical skills. Values efficiency and logic.',
    careers: ['Engineer', 'Mechanic', 'Pilot', 'Forensic Scientist', 'Technical Specialist']
  },
  'ISFP': {
    description: 'Artistic, sensitive, and in tune with surroundings. Enjoys creating beautiful experiences.',
    careers: ['Artist', 'Designer', 'Composer', 'Veterinarian', 'Physical Therapist']
  },
  'INFP': {
    description: 'Idealistic, compassionate, and authentic. Seeks to understand people and help them fulfill their potential.',
    careers: ['Writer', 'Therapist', 'Non-profit Worker', 'Professor', 'UX Designer']
  },
  'INTP': {
    description: 'Analytical, objective, and theoretical. Enjoys pursuing complex ideas and possibilities.',
    careers: ['Software Developer', 'Researcher', 'Mathematician', 'Professor', 'Systems Analyst']
  },
  'ESTP': {
    description: 'Energetic, adaptable, and observant. Thrives on solving immediate problems and taking risks.',
    careers: ['Entrepreneur', 'Police Officer', 'Sales Manager', 'Marketing Executive', 'Sports Coach']
  },
  'ESFP': {
    description: 'Outgoing, spontaneous, and supportive. Lives in the moment and brings joy to others.',
    careers: ['Event Planner', 'Public Relations Specialist', 'Performer', 'Sales Representative', 'Flight Attendant']
  },
  'ENFP': {
    description: 'Enthusiastic, creative, and people-oriented. Seeks to inspire others and explore possibilities.',
    careers: ['Marketing Specialist', 'Entrepreneur', 'Teacher', 'Coach', 'Consultant']
  },
  'ENTP': {
    description: 'Quick-witted, curious, and versatile. Enjoys intellectual challenges and exploring new ideas.',
    careers: ['Entrepreneur', 'Lawyer', 'Creative Director', 'Consultant', 'Software Developer']
  },
  'ESTJ': {
    description: 'Efficient, logical, and traditional. Thrives on creating order and following procedures.',
    careers: ['Manager', 'Military Officer', 'Judge', 'Financial Officer', 'School Principal']
  },
  'ESFJ': {
    description: 'Warm, cooperative, and organized. Values harmony and puts effort into meeting others\' needs.',
    careers: ['Healthcare Administrator', 'Teacher', 'Sales Representative', 'Event Planner', 'HR Manager']
  },
  'ENFJ': {
    description: 'Charismatic, empathetic, and decisive. Natural leaders who inspire others to grow.',
    careers: ['Teacher', 'HR Director', 'Sales Manager', 'Non-profit Leader', 'Counselor']
  },
  'ENTJ': {
    description: 'Strategic, logical, and assertive. Natural leaders who drive toward efficiency and results.',
    careers: ['Executive', 'Entrepreneur', 'Lawyer', 'Management Consultant', 'Business Developer']
  }
};

export function getSuggestedPrompts(mbtiType: string): string[] {
  const generalPrompts = [
    `What careers best suit an ${mbtiType} personality type?`,
    `What skills should I develop as an ${mbtiType}?`,
    `What are the work environment preferences for ${mbtiType}?`,
    `What careers should I avoid as an ${mbtiType}?`,
    `How can I balance my ${mbtiType} strengths and weaknesses in my career?`,
  ];
  
  // Get personality-specific careers from our database
  const personalityInfo = personalityDescriptions[mbtiType] || { careers: [] };
  
  // Add career-specific prompts based on MBTI type
  const careerPrompts = personalityInfo.careers.map(career => 
    `Tell me more about a career as a ${career}`
  ).slice(0, 3); // Take up to 3 career-specific prompts
  
  return [...generalPrompts, ...careerPrompts];
}
