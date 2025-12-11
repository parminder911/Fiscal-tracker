export async function POST(request) {
  try {
    const { project } = await request.json();

    if (!project || !project.allocatedBudget || !project.utilizedBudget) {
      return new Response(
        JSON.stringify({ error: 'Missing required project fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const utilizationPercentage = (project.utilizedBudget / project.allocatedBudget) * 100;
    const daysApproved = project.daysApproved || 0;

    let prediction = 'On Track';
    let confidence = 0.80;

    if (utilizationPercentage < 10 && daysApproved > 60) {
      prediction = 'At Risk';
      confidence = 0.95;
    } else if (daysApproved > 100 && utilizationPercentage < 50) {
      prediction = 'Delayed';
      confidence = 0.90;
    } else if (utilizationPercentage > 85) {
      prediction = 'On Track';
      confidence = 0.92;
    }

    let recommendation = '';
    if (prediction === 'Delayed') {
      recommendation = `URGENT: ${project.name} is delayed with only ${utilizationPercentage.toFixed(1)}% utilization after ${daysApproved} days. Immediate intervention required.`;
    } else if (prediction === 'At Risk') {
      recommendation = `WARNING: ${project.name} is at risk. Utilization is ${utilizationPercentage.toFixed(1)}%. Accelerate fund deployment to prevent delays.`;
    } else {
      recommendation = `OK: ${project.name} is on track with ${utilizationPercentage.toFixed(1)}% utilization.`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          projectName: project.name,
          prediction,
          confidence: (confidence * 100).toFixed(0),
          utilizationPercentage: utilizationPercentage.toFixed(1),
          daysApproved,
          recommendation,
          model: 'Oumi GRPO Fine-tuned Model'
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Prediction error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to predict project health' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
