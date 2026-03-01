/**
 * Activity question bank
 * Keeps content separate from app logic so future activities can be added safely.
 */
const ACTIVITY_SETS = {
    modals_have_v1: {
        id: 'modals_have_v1',
        title: 'Could Have / Should Have / Would Have - Exercise 1',
        subtitle: 'Past Modals Practice',
        instructions: 'Fill only the blank phrase (for example: "could have bought").',
        totalQuestions: 25,
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
