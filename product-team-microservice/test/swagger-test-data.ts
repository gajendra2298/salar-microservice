/**
 * Swagger Test Data for Product Team Microservice
 * This file contains realistic test data for all endpoints that can be used in Swagger UI
 */

// Test data for Add Team Member endpoint
export const addTeamMemberTestData = {
  // Valid test data
  valid: {
    userId: "507f1f77bcf86cd799439011",
    teamMemberId: "507f1f77bcf86cd799439012"
  },
  // Invalid test data for validation testing
  invalid: {
    userId: "invalid-mongo-id",
    teamMemberId: "507f1f77bcf86cd799439012"
  },
  // Missing required fields
  missingFields: {
    userId: "507f1f77bcf86cd799439011"
    // teamMemberId is missing
  }
};

// Test data for Get Pending Team Members endpoint
export const getPendingTeamMembersTestData = {
  // With search text
  withSearch: {
    userId: "REG123456789",
    searchText: "john"
  },
  // Without search text (empty request body)
  withoutSearch: {
    userId: "REG123456789"
  },
  // With special characters in search
  specialCharacters: {
    userId: "REG123456789",
    searchText: "john@123"
  },
  // Long search text
  longSearch: {
    userId: "REG123456789",
    searchText: "verylongsearchtextthatmightexceedlimits"
  }
};

// Test data for Get Team Tree endpoint
export const getTeamTreeTestData = {
  // With search text and level
  withSearchAndLevel: {
    userId: "REG123456789",
    searchText: "alice",
    level: 3,
    registerId: "507f1f77bcf86cd799439011"
  },
  // With only level
  withLevelOnly: {
    userId: "REG123456789",
    level: 2
  },
  // With only search text
  withSearchOnly: {
    userId: "REG123456789",
    searchText: "bob"
  },
  // Empty request
  empty: {
    userId: "REG123456789"
  }
};

// Mock response data for testing
export const mockResponseData = {
  // Pending Team Members Response
  pendingTeamMembers: {
    status: 1,
    message: "Pending team members retrieved successfully",
    data: [
      {
        _id: "507f1f77bcf86cd799439011",
        ulDownlineId: "UL001",
        registerId: "PEND001",
        emailId: "john.doe@example.com",
        fullName: "John Doe",
        organisationName: "Tech Solutions Inc",
        phoneNumber: "+1234567890",
        status: "pending",
        createdAt: "2024-01-15T10:30:00.000Z"
      },
      {
        _id: "507f1f77bcf86cd799439012",
        ulDownlineId: "UL002",
        registerId: "PEND002",
        emailId: "jane.smith@example.com",
        fullName: "Jane Smith",
        organisationName: "Digital Innovations",
        phoneNumber: "+1234567891",
        status: "pending",
        createdAt: "2024-01-16T14:20:00.000Z"
      },
      {
        _id: "507f1f77bcf86cd799439013",
        ulDownlineId: "UL003",
        registerId: "PEND003",
        emailId: "mike.wilson@example.com",
        fullName: "Mike Wilson",
        organisationName: "Global Systems",
        phoneNumber: "+1234567892",
        status: "pending",
        createdAt: "2024-01-17T09:15:00.000Z"
      }
    ],
    count: 3,
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 1
    }
  },

  // Pending Level Details Response
  pendingLevelDetails: {
    status: 1,
    message: "Pending level details retrieved successfully",
    data: [
      {
        level: 1,
        requiredMembers: 2,
        joinedMembers: 1,
        pendingMembers: 1,
        status: "Incomplete",
        completionPercentage: 50
      },
      {
        level: 2,
        requiredMembers: 4,
        joinedMembers: 3,
        pendingMembers: 1,
        status: "Incomplete",
        completionPercentage: 75
      },
      {
        level: 3,
        requiredMembers: 8,
        joinedMembers: 8,
        pendingMembers: 0,
        status: "Complete",
        completionPercentage: 100
      }
    ]
  },

  // Team Tree Details Response
  teamTreeDetails: {
    status: 1,
    message: "Team tree details retrieved successfully",
    data: {
      userId: "507f1f77bcf86cd799439011",
      registerId: "TEAM001",
      fullName: "Team Leader",
      levels: [
        {
          level: 1,
          members: [
            {
              _id: "507f1f77bcf86cd799439012",
              registerId: "MEMBER001",
              fullName: "Alice Johnson",
              emailId: "alice@example.com",
              status: "active",
              joinDate: "2024-01-10T10:00:00.000Z"
            },
            {
              _id: "507f1f77bcf86cd799439013",
              registerId: "MEMBER002",
              fullName: "Bob Brown",
              emailId: "bob@example.com",
              status: "active",
              joinDate: "2024-01-12T14:30:00.000Z"
            }
          ],
          totalMembers: 2,
          requiredMembers: 2,
          status: "Complete"
        },
        {
          level: 2,
          members: [
            {
              _id: "507f1f77bcf86cd799439014",
              registerId: "MEMBER003",
              fullName: "Charlie Davis",
              emailId: "charlie@example.com",
              status: "active",
              joinDate: "2024-01-15T09:00:00.000Z"
            }
          ],
          totalMembers: 1,
          requiredMembers: 4,
          status: "Incomplete"
        }
      ],
      totalLevels: 2,
      totalMembers: 3
    }
  },

  // Network Team Count Response
  networkTeamCount: {
    status: 1,
    message: "Network team count retrieved successfully",
    data: {
      totalMembers: 15,
      activeMembers: 12,
      pendingMembers: 3,
      levels: {
        level1: 2,
        level2: 4,
        level3: 8,
        level4: 1
      },
      earnings: {
        totalEarnings: 2500.00,
        thisMonth: 450.00,
        lastMonth: 380.00
      }
    }
  },

  // Add Team Member Success Response
  addTeamMemberSuccess: {
    status: 1,
    message: "Team member added successfully",
    data: {
      userId: "507f1f77bcf86cd799439011",
      teamMemberId: "507f1f77bcf86cd799439012",
      addedAt: "2024-01-20T10:30:00.000Z",
      status: "active"
    }
  },

  // Error Responses
  errorResponses: {
    unauthorized: {
      status: 0,
      message: "Unauthorized access"
    },
    validationError: {
      status: 0,
      message: "Validation failed",
      errors: [
        {
          field: "userId",
          message: "userId must be a valid MongoDB ObjectId"
        }
      ]
    },
    notFound: {
      status: 0,
      message: "User not found"
    },
    internalServerError: {
      status: 0,
      message: "Internal server error"
    }
  }
};

// Test JWT tokens for authentication
export const testJwtTokens = {
  validToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsInVzZXJJZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsInJlZ2lzdGVySWQiOiJURUFNMDAxIiwiaWF0IjoxNzA1NzM5NjAwLCJleHAiOjE3MDU4MjYwMDB9.example-signature",
  expiredToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTcwNTczOTYwMCwiZXhwIjoxNzA1NzM5NjAwfQ.expired-signature",
  invalidToken: "invalid.jwt.token"
};

// Test register IDs for parameter testing
export const testRegisterIds = {
  valid: "TEAM001",
  invalid: "INVALID_ID",
  nonExistent: "NONEXISTENT001"
};

// Test levels for query parameter testing
export const testLevels = {
  valid: [1, 2, 3, 4, 5],
  invalid: [-1, 0, 100, "invalid"]
};

// Complete test scenarios for Swagger
export const swaggerTestScenarios = {
  // Add Team Member scenarios
  addTeamMember: {
    success: {
      description: "Successfully add a team member",
      requestBody: addTeamMemberTestData.valid,
      expectedResponse: mockResponseData.addTeamMemberSuccess
    },
    validationError: {
      description: "Try to add team member with invalid user ID",
      requestBody: addTeamMemberTestData.invalid,
      expectedResponse: mockResponseData.errorResponses.validationError
    },
    missingFields: {
      description: "Try to add team member with missing required fields",
      requestBody: addTeamMemberTestData.missingFields,
      expectedResponse: mockResponseData.errorResponses.validationError
    }
  },

  // Get Pending Team Members scenarios
  getPendingTeamMembers: {
    withSearch: {
      description: "Get pending team members with search text",
      requestBody: getPendingTeamMembersTestData.withSearch,
      expectedResponse: mockResponseData.pendingTeamMembers
    },
    withoutSearch: {
      description: "Get all pending team members without search",
      requestBody: getPendingTeamMembersTestData.withoutSearch,
      expectedResponse: mockResponseData.pendingTeamMembers
    }
  },

  // Get Team Tree scenarios
  getTeamTree: {
    withParameters: {
      description: "Get team tree with search and level parameters",
      requestBody: getTeamTreeTestData.withSearchAndLevel,
      expectedResponse: mockResponseData.teamTreeDetails
    },
    emptyRequest: {
      description: "Get team tree without any parameters",
      requestBody: getTeamTreeTestData.empty,
      expectedResponse: mockResponseData.teamTreeDetails
    }
  },

  // Authentication scenarios
  authentication: {
    validToken: {
      description: "Use valid JWT token",
      headers: {
        "Authorization": `Bearer ${testJwtTokens.validToken}`
      }
    },
    invalidToken: {
      description: "Use invalid JWT token",
      headers: {
        "Authorization": `Bearer ${testJwtTokens.invalidToken}`
      },
      expectedResponse: mockResponseData.errorResponses.unauthorized
    },
    noToken: {
      description: "Make request without JWT token",
      headers: {},
      expectedResponse: mockResponseData.errorResponses.unauthorized
    }
  }
};

// Export all test data
export default {
  addTeamMemberTestData,
  getPendingTeamMembersTestData,
  getTeamTreeTestData,
  mockResponseData,
  testJwtTokens,
  testRegisterIds,
  testLevels,
  swaggerTestScenarios
}; 