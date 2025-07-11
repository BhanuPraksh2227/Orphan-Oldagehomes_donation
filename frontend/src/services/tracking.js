export const trackImpact = {
  calculateImpact: (donations) => {
    return {
      totalAmount: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
      beneficiariesHelped: donations.length * 2,
      facilitiesSupported: new Set(donations.map(d => d.facility)).size
    };
  },
  
  generateReport: (data) => {
    return {
      monthly: groupByMonth(data),
      categories: groupByCategory(data),
      topDonors: getTopDonors(data)
    };
  }
};