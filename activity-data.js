/**
 * Activity question bank
 * Keeps content separate from app logic so future activities can be added safely.
 */
const ACTIVITY_SETS = {
    level_assessment_v1: {
        id: 'level_assessment_v1',
        title: 'Level Assessment Test',
        navTitle: 'Self Assessment',
        subtitle: 'English Proficiency Test',
        instructions: 'Answer all 30 questions. Each question carries 1 mark.',
        totalQuestions: 30,
        passMark: 18,
        timeLimit: 30, // minutes
        reportEnabled: false,
        sections: [
            { name: 'Section A: Grammar', questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], totalMarks: 10 },
            { name: 'Section B: Vocabulary', questions: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], totalMarks: 10 },
            { name: 'Section C: Sentence Skills', questions: [21, 22, 23, 24, 25], totalMarks: 5 },
            { name: 'Section D: Reading Comprehension', questions: [26, 27, 28, 29, 30], totalMarks: 5 }
        ],
        grading: [
            { grade: 'A+', level: 'Excellent', minScore: 27, maxScore: 30, percentage: '90-100%', remarks: 'Outstanding mastery - Ready for advanced level' },
            { grade: 'A', level: 'Very Good', minScore: 24, maxScore: 26, percentage: '80-89%', remarks: 'Strong proficiency - Minor gaps' },
            { grade: 'B+', level: 'Good', minScore: 21, maxScore: 23, percentage: '70-79%', remarks: 'Good understanding - Needs practice on weak areas' },
            { grade: 'B', level: 'Average', minScore: 18, maxScore: 20, percentage: '60-69%', remarks: 'Fair level - Requires focused revision' },
            { grade: 'C', level: 'Below Average', minScore: 15, maxScore: 17, percentage: '50-59%', remarks: 'Needs improvement - Target grammar/vocabulary' },
            { grade: 'D', level: 'Needs Help', minScore: 0, maxScore: 14, percentage: 'Below 50%', remarks: 'Basic level - Start with foundation worksheets' }
        ],
        questions: [
            // Section A: Grammar (10 questions)
            {
                id: 1,
                type: 'multiple_choice',
                prompt: "She ___ a letter when the phone rang.",
                options: ['writes', 'was writing', 'wrote'],
                correctAnswer: 1, // index of 'was writing'
                explanation: "Use past continuous for an action in progress when another action happened."
            },
            {
                id: 2,
                type: 'multiple_choice',
                prompt: "By next year, they ___ the project.",
                options: ['complete', 'will complete', 'will have completed'],
                correctAnswer: 2, // index of 'will have completed'
                explanation: "Use future perfect for an action that will be completed before a future point."
            },
            {
                id: 3,
                type: 'multiple_choice',
                prompt: "Neither the teacher nor the students ___ happy.",
                options: ['was', 'were', 'is'],
                correctAnswer: 1, // index of 'were'
                explanation: "With 'neither...nor', the verb agrees with the nearest subject (students -> plural)."
            },
            {
                id: 4,
                type: 'multiple_choice',
                prompt: "If it ___ rain, we will stay home.",
                options: ['rains', 'will rain', 'rained'],
                correctAnswer: 0, // index of 'rains'
                explanation: "In first conditional, use present simple after 'if' (not 'will rain')."
            },
            {
                id: 5,
                type: 'multiple_choice',
                prompt: "He ___ to the market yesterday.",
                options: ['go', 'goes', 'went'],
                correctAnswer: 2, // index of 'went'
                explanation: "'Yesterday' indicates past simple tense."
            },
            {
                id: 6,
                type: 'multiple_choice',
                prompt: "The book ___ on the table since morning.",
                options: ['is lying', 'has been lying', 'lies'],
                correctAnswer: 1, // index of 'has been lying'
                explanation: "Use present perfect continuous with 'since' for an action started in past and continuing."
            },
            {
                id: 7,
                type: 'multiple_choice',
                prompt: "You ___ finish your homework before playing.",
                options: ['can', 'must', 'may'],
                correctAnswer: 1, // index of 'must'
                explanation: "'Must' expresses obligation/necessity."
            },
            {
                id: 8,
                type: 'fill_blank',
                prompt: "She is afraid ___ dogs.",
                correctAnswer: 'of',
                normalizedAnswers: ['of'],
                explanation: "'Afraid of' is the correct collocation."
            },
            {
                id: 9,
                type: 'multiple_choice',
                prompt: 'Reported speech: "I am tired," he said. → He said that he ___.',
                options: ['is tired', 'was tired', 'tired'],
                correctAnswer: 1, // index of 'was tired'
                explanation: "In reported speech, present tense changes to past tense."
            },
            {
                id: 10,
                type: 'multiple_choice',
                prompt: "A bunch of keys ___ on the floor.",
                options: ['lie', 'lies', 'lying'],
                correctAnswer: 1, // index of 'lies'
                explanation: "'Bunch' is the singular head noun, so it takes a singular verb: 'lies'."
            },
            // Section B: Vocabulary (10 questions)
            {
                id: 11,
                type: 'multiple_choice',
                prompt: "Synonym of 'brave':",
                options: ['coward', 'courageous', 'weak'],
                correctAnswer: 1, // index of 'courageous'
                explanation: "'Courageous' means brave."
            },
            {
                id: 12,
                type: 'multiple_choice',
                prompt: "Antonym of 'ancient':",
                options: ['old', 'modern', 'new'],
                correctAnswer: 1, // index of 'modern'
                explanation: "'Modern' is the opposite of 'ancient'."
            },
            {
                id: 13,
                type: 'multiple_choice',
                prompt: '"The meeting was ___ due to rain."',
                options: ['postponed', 'postposed', 'preponed'],
                correctAnswer: 0, // index of 'postponed'
                explanation: "'Postpone' means to delay. 'Postponed' is the correct past participle."
            },
            {
                id: 14,
                type: 'multiple_choice',
                prompt: 'Idiom: "Break a leg" means:',
                options: ['hurt yourself', 'good luck', 'run fast'],
                correctAnswer: 1, // index of 'good luck'
                explanation: "'Break a leg' is an idiom meaning 'good luck', especially before a performance."
            },
            {
                id: 15,
                type: 'multiple_choice',
                prompt: 'Choose correct: "Advice" or "advise"? She gave me good ___.',
                options: ['advice', 'advise'],
                correctAnswer: 0, // index of 'advice'
                explanation: "'Advice' is a noun (uncountable), 'advise' is a verb."
            },
            {
                id: 16,
                type: 'multiple_choice',
                prompt: "Synonym of 'diligent':",
                options: ['lazy', 'hardworking', 'careless'],
                correctAnswer: 1, // index of 'hardworking'
                explanation: "'Hardworking' means diligent."
            },
            {
                id: 17,
                type: 'multiple_choice',
                prompt: '"He is ___ his brother."',
                options: ['taller than', 'more tall than'],
                correctAnswer: 0, // index of 'taller than'
                explanation: "Use 'taller than' (not 'more tall than') for comparative of short adjectives."
            },
            {
                id: 18,
                type: 'multiple_choice',
                prompt: "Antonym of 'generous':",
                options: ['kind', 'selfish', 'helpful'],
                correctAnswer: 1, // index of 'selfish'
                explanation: "'Selfish' is the opposite of 'generous'."
            },
            {
                id: 19,
                type: 'multiple_choice',
                prompt: 'Word meaning "very small":',
                options: ['tiny', 'huge', 'big'],
                correctAnswer: 0, // index of 'tiny'
                explanation: "'Tiny' means very small."
            },
            {
                id: 20,
                type: 'multiple_choice',
                prompt: '"Accept" or "except"? I like all fruits ___ mango.',
                options: ['accept', 'except'],
                correctAnswer: 1, // index of 'except'
                explanation: "'Except' means 'not including'. 'Accept' means to receive."
            },
            // Section C: Sentence Skills (5 questions)
            {
                id: 21,
                type: 'rearrange',
                prompt: "Rearrange: school / to / went / I / bus / by",
                correctAnswer: 'I went to school by bus',
                normalizedAnswers: ['i went to school by bus', 'went to school by bus'],
                explanation: "The correct order is: Subject + Verb + Object + Manner/Place."
            },
            {
                id: 22,
                type: 'fill_blank',
                prompt: "The children ___ (play) in the park when it started raining.",
                correctAnswer: 'were playing',
                normalizedAnswers: ['were playing'],
                explanation: "Use past continuous for an action in progress when another action happened."
            },
            {
                id: 23,
                type: 'multiple_choice',
                prompt: "Choose preposition: He is good ___ maths.",
                options: ['in', 'at', 'on'],
                correctAnswer: 1, // index of 'at'
                explanation: "'Good at' is the correct collocation."
            },
            {
                id: 24,
                type: 'multiple_choice',
                prompt: "Modal: You ___ smoke here. (prohibited)",
                options: ['mustn\'t', 'can', 'might'],
                correctAnswer: 0, // index of 'mustn\'t'
                explanation: "'Mustn't' expresses prohibition."
            },
            {
                id: 25,
                type: 'multiple_choice',
                prompt: "Concord: Each of the boys ___ a gift.",
                options: ['have', 'has', 'having'],
                correctAnswer: 1, // index of 'has'
                explanation: "'Each' always takes a singular verb."
            },
            // Section D: Reading Comprehension (5 questions)
            {
                id: 26,
                type: 'reading_comprehension',
                passage: "In a small town, there lived a boy named Amit. He loved reading books about science. Every evening, he went to the library to borrow new books. One day, he found a book on rockets. It explained how rockets work in space. Amit dreamed of becoming an astronaut. His teacher encouraged him to study hard.",
                prompt: "Where did Amit go every evening?",
                correctAnswer: 'library',
                normalizedAnswers: ['library', 'to the library'],
                explanation: "The passage states: 'Every evening, he went to the library to borrow new books.'"
            },
            {
                id: 27,
                type: 'multiple_choice',
                passage: "In a small town, there lived a boy named Amit. He loved reading books about science. Every evening, he went to the library to borrow new books. One day, he found a book on rockets. It explained how rockets work in space. Amit dreamed of becoming an astronaut. His teacher encouraged him to study hard.",
                prompt: "What did the book explain?",
                options: ['animals', 'rockets', 'food'],
                correctAnswer: 1, // index of 'rockets'
                explanation: "The passage states: 'It explained how rockets work in space.'"
            },
            {
                id: 28,
                type: 'reading_comprehension',
                passage: "In a small town, there lived a boy named Amit. He loved reading books about science. Every evening, he went to the library to borrow new books. One day, he found a book on rockets. It explained how rockets work in space. Amit dreamed of becoming an astronaut. His teacher encouraged him to study hard.",
                prompt: "Inference: What does Amit want to be?",
                correctAnswer: 'astronaut',
                normalizedAnswers: ['astronaut', 'an astronaut'],
                explanation: "The passage states: 'Amit dreamed of becoming an astronaut.'"
            },
            {
                id: 29,
                type: 'multiple_choice',
                passage: "In a small town, there lived a boy named Amit. He loved reading books about science. Every evening, he went to the library to borrow new books. One day, he found a book on rockets. It explained how rockets work in space. Amit dreamed of becoming an astronaut. His teacher encouraged him to study hard.",
                prompt: 'Synonym in passage: "Encouraged" means:',
                options: ['stopped', 'motivated', 'ignored'],
                correctAnswer: 1, // index of 'motivated'
                explanation: "In context, 'encouraged' means to give support, confidence, or hope - synonymous with 'motivated'."
            },
            {
                id: 30,
                type: 'multiple_choice',
                passage: "In a small town, there lived a boy named Amit. He loved reading books about science. Every evening, he went to the library to borrow new books. One day, he found a book on rockets. It explained how rockets work in space. Amit dreamed of becoming an astronaut. His teacher encouraged him to study hard.",
                prompt: "True/False: Amit's teacher discouraged him.",
                options: ['True', 'False'],
                correctAnswer: 1, // index of 'False'
                explanation: "The passage says 'His teacher encouraged him to study hard', so the statement is false."
            }
        ]
    },
    modals_have_v1: {
        id: 'modals_have_v1',
        title: 'Could Have / Should Have / Would Have - Exercise 1',
        navTitle: 'Past Modals',
        subtitle: 'Past Modals Practice',
        instructions: 'Fill only the blank phrase (for example: "could have bought").',
        totalQuestions: 25,
        reportEnabled: true,
        questions: [
            {
                id: 1,
                prompt: "I ____ (buy) bread but I didn't know we needed it.",
                category: 'past possibility',
                expectedPhrase: 'could have bought',
                normalizedExpectedPhrase: 'could have bought',
                modelSentence: "I could have bought bread but I didn't know we needed it."
            },
            {
                id: 2,
                prompt: "We ____ (invite) so many people to our party! I'm worried that we won't have enough room for everyone.",
                category: 'past negative advice / regret',
                expectedPhrase: "shouldn't have invited",
                normalizedExpectedPhrase: "shouldn't have invited",
                modelSentence: "We shouldn't have invited so many people to our party! I'm worried that we won't have enough room for everyone."
            },
            {
                id: 3,
                prompt: 'I ____ (start) saving money years ago!',
                category: 'past advice / regret',
                expectedPhrase: 'should have started',
                normalizedExpectedPhrase: 'should have started',
                modelSentence: 'I should have started saving money years ago!'
            },
            {
                id: 4,
                prompt: "We ____ (join) you at the restaurant, but we couldn't get a babysitter.",
                category: 'past willingness',
                expectedPhrase: 'would have joined',
                normalizedExpectedPhrase: 'would have joined',
                modelSentence: "We would have joined you at the restaurant, but we couldn't get a babysitter."
            },
            {
                id: 5,
                prompt: 'The weather ____ (be) any worse!',
                category: 'past negative possibility',
                expectedPhrase: "couldn't have been",
                normalizedExpectedPhrase: "couldn't have been",
                modelSentence: "The weather couldn't have been any worse!"
            },
            {
                id: 6,
                prompt: "I ____ (arrive) on time, even if I'd left earlier. There were dreadful traffic jams all the way.",
                category: 'past negative possibility',
                expectedPhrase: "couldn't have arrived",
                normalizedExpectedPhrase: "couldn't have arrived",
                modelSentence: "I couldn't have arrived on time, even if I'd left earlier. There were dreadful traffic jams all the way."
            },
            {
                id: 7,
                prompt: 'They ____ (win) the football match, but John hurt his ankle.',
                category: 'past possibility',
                expectedPhrase: 'could have won',
                normalizedExpectedPhrase: 'could have won',
                modelSentence: 'They could have won the football match, but John hurt his ankle.'
            },
            {
                id: 8,
                prompt: 'Amanda ____ (finish) the work, but she felt ill and had to go home.',
                category: 'past willingness',
                expectedPhrase: 'would have finished',
                normalizedExpectedPhrase: 'would have finished',
                modelSentence: 'Amanda would have finished the work, but she felt ill and had to go home.'
            },
            {
                id: 9,
                prompt: 'Lucy ____ (leave) earlier. She missed her flight.',
                category: 'past advice / regret',
                expectedPhrase: 'should have left',
                normalizedExpectedPhrase: 'should have left',
                modelSentence: 'Lucy should have left earlier. She missed her flight.'
            },
            {
                id: 10,
                prompt: "We ____ (finish) the game, even if we'd wanted to. It was raining very hard and we had to stop.",
                category: 'past negative possibility',
                expectedPhrase: "couldn't have finished",
                normalizedExpectedPhrase: "couldn't have finished",
                modelSentence: "We couldn't have finished the game, even if we'd wanted to. It was raining very hard and we had to stop."
            },
            {
                id: 11,
                prompt: 'I ____ (eat) so much chocolate! I feel sick!',
                category: 'past negative advice / regret',
                expectedPhrase: "shouldn't have eaten",
                normalizedExpectedPhrase: "shouldn't have eaten",
                modelSentence: "I shouldn't have eaten so much chocolate! I feel sick!"
            },
            {
                id: 12,
                prompt: "Luke ____ (pass) the exam if he'd studied a bit more.",
                category: 'past possibility',
                expectedPhrase: 'could have passed',
                normalizedExpectedPhrase: 'could have passed',
                modelSentence: "Luke could have passed the exam if he'd studied a bit more."
            },
            {
                id: 13,
                prompt: "John ____ (call) Amy, but he didn't have her number.",
                category: 'past willingness',
                expectedPhrase: 'would have called',
                normalizedExpectedPhrase: 'would have called',
                modelSentence: "John would have called Amy, but he didn't have her number."
            },
            {
                id: 14,
                prompt: "You ____ (be) rude to him. He's going to be really angry now.",
                category: 'past negative advice / regret',
                expectedPhrase: "shouldn't have been",
                normalizedExpectedPhrase: "shouldn't have been",
                modelSentence: "You shouldn't have been rude to him. He's going to be really angry now."
            },
            {
                id: 15,
                prompt: "She ____ (come) to the restaurant if she'd left work earlier.",
                category: 'past possibility',
                expectedPhrase: 'could have come',
                normalizedExpectedPhrase: 'could have come',
                modelSentence: "She could have come to the restaurant if she'd left work earlier."
            },
            {
                id: 16,
                prompt: "You ____ (take) this job. I can see you're not enjoying it.",
                category: 'past negative advice / regret',
                expectedPhrase: "shouldn't have taken",
                normalizedExpectedPhrase: "shouldn't have taken",
                modelSentence: "You shouldn't have taken this job. I can see you're not enjoying it."
            },
            {
                id: 17,
                prompt: "The race was really difficult. She ____ (win) because she's not fit enough.",
                category: 'past negative possibility',
                expectedPhrase: "couldn't have won",
                normalizedExpectedPhrase: "couldn't have won",
                modelSentence: "The race was really difficult. She couldn't have won because she's not fit enough."
            },
            {
                id: 18,
                prompt: 'Our neighbours ____ (cut) down the tree in their garden. It was a really beautiful tree.',
                category: 'past negative advice / regret',
                expectedPhrase: "shouldn't have cut",
                normalizedExpectedPhrase: "shouldn't have cut",
                modelSentence: "Our neighbours shouldn't have cut down the tree in their garden. It was a really beautiful tree."
            },
            {
                id: 19,
                prompt: "The children ____ (do) their homework last night. Then they wouldn't be panicking on the way to school.",
                category: 'past advice / regret',
                expectedPhrase: 'should have done',
                normalizedExpectedPhrase: 'should have done',
                modelSentence: "The children should have done their homework last night. Then they wouldn't be panicking on the way to school."
            },
            {
                id: 20,
                prompt: "I'm really cold! I ____ (bring) my coat.",
                category: 'past advice / regret',
                expectedPhrase: 'should have brought',
                normalizedExpectedPhrase: 'should have brought',
                modelSentence: "I'm really cold! I should have brought my coat."
            },
            {
                id: 21,
                prompt: "I ____ (come) to see you! I didn't know you were ill.",
                category: 'past willingness',
                expectedPhrase: 'would have come',
                normalizedExpectedPhrase: 'would have come',
                modelSentence: "I would have come to see you! I didn't know you were ill."
            },
            {
                id: 22,
                prompt: 'Andrew ____ (go) to Cambridge University, but he decided to travel instead.',
                category: 'past possibility',
                expectedPhrase: 'could have gone',
                normalizedExpectedPhrase: 'could have gone',
                modelSentence: 'Andrew could have gone to Cambridge University, but he decided to travel instead.'
            },
            {
                id: 23,
                prompt: 'They ____ (be) kinder to me. They were absolutely lovely.',
                category: 'past negative possibility',
                expectedPhrase: "couldn't have been",
                normalizedExpectedPhrase: "couldn't have been",
                modelSentence: "They couldn't have been kinder to me. They were absolutely lovely."
            },
            {
                id: 24,
                prompt: "You ____ (buy) some milk at the shops. We don't have any milk.",
                category: 'past advice / regret',
                expectedPhrase: 'should have bought',
                normalizedExpectedPhrase: 'should have bought',
                modelSentence: "You should have bought some milk at the shops. We don't have any milk."
            },
            {
                id: 25,
                prompt: 'They ____ (come) to have breakfast with us, but they went to bed too late the night before.',
                category: 'past willingness',
                expectedPhrase: 'would have come',
                normalizedExpectedPhrase: 'would have come',
                modelSentence: 'They would have come to have breakfast with us, but they went to bed too late the night before.'
            }
        ]
    }
};
