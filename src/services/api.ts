// Mock API service for intern dashboard
export interface User {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  totalRaised: number;
  rank?: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  totalRaised: number;
  rank: number;
  profileImage?: string;
  department?: string;
}

// Mock user data
const mockUsers: User[] = [
  { id: "1", name: "Alex Chen", email: "alex.chen@company.com", referralCode: "AC2024X7", totalRaised: 1250 },
  { id: "2", name: "Sarah Johnson", email: "sarah.j@company.com", referralCode: "SJ2024Y9", totalRaised: 2840 },
  { id: "3", name: "Michael Rodriguez", email: "m.rodriguez@company.com", referralCode: "MR2024Z3", totalRaised: 3150 },
  { id: "4", name: "Emily Davis", email: "emily.d@company.com", referralCode: "ED2024A1", totalRaised: 1890 },
  { id: "5", name: "David Kim", email: "david.kim@company.com", referralCode: "DK2024B5", totalRaised: 2670 },
  { id: "6", name: "Lisa Wang", email: "lisa.wang@company.com", referralCode: "LW2024C8", totalRaised: 1560 },
  { id: "7", name: "James Wilson", email: "j.wilson@company.com", referralCode: "JW2024D2", totalRaised: 2230 },
  { id: "8", name: "Maria Garcia", email: "maria.g@company.com", referralCode: "MG2024E6", totalRaised: 1780 },
  { id: "9", name: "Robert Taylor", email: "robert.t@company.com", referralCode: "RT2024F4", totalRaised: 2950 },
  { id: "10", name: "Jennifer Brown", email: "jennifer.b@company.com", referralCode: "JB2024G1", totalRaised: 1420 }
];

// Generate department names
const departments = ["Engineering", "Marketing", "Design", "Sales", "HR", "Finance"];

// Create leaderboard with additional data
const createLeaderboard = (): LeaderboardEntry[] => {
  return mockUsers
    .map((user, index) => ({
      ...user,
      rank: 0, // Will be set after sorting
      department: departments[Math.floor(Math.random() * departments.length)],
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name.replace(/\s+/g, '')}`
    }))
    .sort((a, b) => b.totalRaised - a.totalRaised)
    .map((user, index) => ({
      ...user,
      rank: index + 1
    }));
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // Get current user data
  async getCurrentUser(userId: string): Promise<User> {
    await delay(800);
    let user = mockUsers.find(u => u.id === userId);
    
    // If user not found in mock data, check localStorage for newly registered users
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.id === userId) {
          user = {
            ...parsedUser,
            totalRaised: parsedUser.totalRaised || 0
          };
          // Add the new user to mockUsers array for future API calls
          mockUsers.push(user);
        }
      }
    }
    
    if (!user) throw new Error('User not found');
    
    // Add realistic fluctuation to donations
    const fluctuation = Math.floor(Math.random() * 100) - 50;
    return {
      ...user,
      totalRaised: Math.max(0, user.totalRaised + fluctuation)
    };
  },

  // Get leaderboard data
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    await delay(1200);
    return createLeaderboard();
  },

  // Update user donation amount (for demo purposes)
  async updateDonations(userId: string, amount: number): Promise<User> {
    await delay(500);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    
    user.totalRaised += amount;
    return user;
  },

  // Get user statistics
  async getUserStats(userId: string) {
    await delay(600);
    let user = mockUsers.find(u => u.id === userId);
    
    // If user not found in mock data, check localStorage for newly registered users
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.id === userId) {
          user = {
            ...parsedUser,
            totalRaised: parsedUser.totalRaised || 0
          };
          // Add the new user to mockUsers array if not already added
          if (!mockUsers.find(u => u.id === userId)) {
            mockUsers.push(user);
          }
        }
      }
    }
    
    if (!user) throw new Error('User not found');

    const leaderboard = createLeaderboard();
    const userRank = leaderboard.find(u => u.id === userId)?.rank || 0;
    
    return {
      totalRaised: user.totalRaised,
      rank: userRank,
      totalParticipants: mockUsers.length,
      percentileRank: Math.round(((mockUsers.length - userRank + 1) / mockUsers.length) * 100),
      monthlyGrowth: Math.floor(Math.random() * 30) + 5, // Random growth between 5-35%
      referrals: Math.floor(user.totalRaised / 100), // Estimate referrals based on donations
    };
  }
};