export const taskSchema = {
  'type': 'object',
  'id': '#userGroup',
  'properties': {
    '_type': {
      'type': 'string',
      'default': 'userGroup'
    },
    'label': {
      'type': 'string'
    },
    'users': {
      'type': 'array',
      'items': {
        '$ref': '#/definitions/user'
      }
    }
  },
  'additionalProperties': false,
  'definitions': {
    'task': {
      'type': 'object',
      'id': '#task',
      'properties': {
        '_type': {
          'type': 'string',
          'default': 'task'
        },
        'name': {
          'type': 'string'
        },
        'dueDate': {
          'type': 'string',
          'format': 'date'
        },
        'done': {
          'type': 'boolean'
        },
        'priority': {
          'type': 'string',
          'enum': ['High', 'Medium', 'Low'],
          'default': 'Medium'
        },
        'subTasks': {
          'type': 'array',
          'items': {
            '$ref': '#/definitions/task'
          }
        }
      },
      'required': [ 'name', 'priority' ],
      'additionalProperties': false
    },
    'user': {
      'type': 'object',
      'id': '#user',
      'properties': {
        '_type': {
          'type': 'string',
          'default': 'user'
        },
        'name': {
          'type': 'string'
        },
        'birthday': {
          'type': 'string',
          'format': 'date'
        },
        'nationality': {
          'type': 'string',
          'enum': ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
        },
        'tasks': {
          'type': 'array',
          'items': {
            '$ref': '#/definitions/task'
          }
        }
      },
      'required': [ 'name' ],
      'additionalProperties': false
    }
  }
};
