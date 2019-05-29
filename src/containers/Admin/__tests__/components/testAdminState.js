export default {
  admin: {
    creator: {
      creator_id: '2',
    },
    boards: [
      {
        team_id: '123',
        name: 'board1',
        created: '',
        seats: '2',
        projects: [
          {
            skill_id: '234',
            skill_name: 'skill1',
            skill_created: '',
            summary: 'skill summary',
            description: 'skill description'
          },
          {
            skill_id: '345',
            skill_name: 'skill2',
            skill_created: '',
            summary: 'skill summary',
            description: 'skill description'
          }
        ]
      },
      {
        team_id: '1234',
        name: 'board2',
        created: '',
        seats: '4',
        projects: [
          {
            skill_id: '345',
            skill_name: 'skill3',
            skill_created: '',
            summary: 'skill summary',
            description: 'skill description'
          }
        ]
      }
    ]
  }
};
