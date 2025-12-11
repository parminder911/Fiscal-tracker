export const mockVillages = [
  {
    id: 1,
    name: "Amritsar Village",
    district: "Amritsar",
    state: "Punjab",
    population: 5000,
    projects: [
      {
        id: 101,
        name: "Road Construction",
        allocatedBudget: 500000,
        utilizedBudget: 450000,
        status: "On Track",
        daysApproved: 45,
        department: "Public Works"
      },
      {
        id: 102,
        name: "School Building",
        allocatedBudget: 1000000,
        utilizedBudget: 650000,
        status: "On Track",
        daysApproved: 60,
        department: "Education"
      }
    ]
  },
  {
    id: 2,
    name: "Ludhiana Village",
    district: "Ludhiana",
    state: "Punjab",
    population: 4200,
    projects: [
      {
        id: 201,
        name: "Water Supply System",
        allocatedBudget: 750000,
        utilizedBudget: 200000,
        status: "At Risk",
        daysApproved: 90,
        department: "Water Resources"
      },
      {
        id: 202,
        name: "Health Center",
        allocatedBudget: 600000,
        utilizedBudget: 580000,
        status: "On Track",
        daysApproved: 30,
        department: "Health"
      }
    ]
  },
  {
    id: 3,
    name: "Jalandhar Village",
    district: "Jalandhar",
    state: "Punjab",
    population: 3800,
    projects: [
      {
        id: 301,
        name: "Community Center",
        allocatedBudget: 400000,
        utilizedBudget: 50000,
        status: "Delayed",
        daysApproved: 120,
        department: "Community Development"
      },
      {
        id: 302,
        name: "Electricity Grid",
        allocatedBudget: 900000,
        utilizedBudget: 850000,
        status: "On Track",
        daysApproved: 50,
        department: "Power"
      }
    ]
  }
];

export const mockUsers = [
  {
    id: 1,
    userId: "admin001",
    email: "admin@fiscaltracker.gov.in",
    role: "admin",
    district: null,
    name: "State Admin"
  },
  {
    id: 2,
    userId: "officer_amritsar",
    email: "officer@amritsar.gov.in",
    role: "district_officer",
    district: "Amritsar",
    name: "Amritsar Officer"
  },
  {
    id: 3,
    userId: "officer_ludhiana",
    email: "officer@ludhiana.gov.in",
    role: "district_officer",
    district: "Ludhiana",
    name: "Ludhiana Officer"
  }
];

export function getProjectHealth(project) {
  const utilizationPercentage = (project.utilizedBudget / project.allocatedBudget) * 100;
  
  if (project.status === "Delayed") {
    return "Delayed";
  }
  
  if (utilizationPercentage < 10 && project.daysApproved > 60) {
    return "At Risk";
  }
  
  if (utilizationPercentage > 90) {
    return "On Track";
  }
  
  return "On Track";
}

export function calculateDistrictSummary(villages) {
  let totalAllocated = 0;
  let totalUtilized = 0;
  let projectCount = 0;
  const statusCount = { "On Track": 0, "At Risk": 0, "Delayed": 0 };

  villages.forEach(village => {
    village.projects.forEach(project => {
      totalAllocated += project.allocatedBudget;
      totalUtilized += project.utilizedBudget;
      projectCount += 1;
      statusCount[project.status]++;
    });
  });

  return {
    totalAllocated,
    totalUtilized,
    utilizationPercentage: ((totalUtilized / totalAllocated) * 100).toFixed(2),
    projectCount,
    statusCount
  };
}
