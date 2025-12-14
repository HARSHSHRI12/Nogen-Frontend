export const easyQuestions = [
    {
      title: 'Easy Question 1',
      description: 'Solve this easy problem',
      input: 'input 1',
      output: 'output 1',
      difficulty: 'easy',
      topics: ['Array', 'String'],
      testCases: [
        { input: 'input 1', output: 'output 1' },
        { input: 'input 2', output: 'output 2' },
      ],
      boilerplate: {
        javascript: 'console.log("Easy Question 1 solution")',
        python: 'print("Easy Question 1 solution")',
      },
      solved: false,
    },
    // Add more easy questions here...
  ];
  
  export const mediumQuestions = [
    {
      title: 'Medium Question 1',
      description: 'Solve this medium problem',
      input: 'input 3',
      output: 'output 3',
      difficulty: 'medium',
      topics: ['Linked List', 'Stack'],
      testCases: [
        { input: 'input 3', output: 'output 3' },
        { input: 'input 4', output: 'output 4' },
      ],
      boilerplate: {
        javascript: 'console.log("Medium Question 1 solution")',
        python: 'print("Medium Question 1 solution")',
      },
      solved: false,
    },
    // Add more medium questions here...
  ];
  
  export const hardQuestions = [
    {
      title: 'Hard Question 1',
      description: 'Solve this hard problem',
      input: 'input 5',
      output: 'output 5',
      difficulty: 'hard',
      topics: ['Tree', 'Graph'],
      testCases: [
        { input: 'input 5', output: 'output 5' },
        { input: 'input 6', output: 'output 6' },
      ],
      boilerplate: {
        javascript: 'console.log("Hard Question 1 solution")',
        python: 'print("Hard Question 1 solution")',
      },
      solved: false,
    },
    // Add more hard questions here...
  ];
  
  export const generateMockQuestions = () => [
    ...easyQuestions,
    ...mediumQuestions,
    ...hardQuestions,
  ];
  