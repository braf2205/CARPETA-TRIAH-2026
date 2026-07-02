export async function POST() {
  try {
    const txRes = await fetch(
      "http://127.0.0.1:8000/transactions/",
      {
        cache: "no-store",
      }
    );

    const goalsRes = await fetch(
      "http://127.0.0.1:8000/goals/",
      {
        cache: "no-store",
      }
    );

    const transactions = await txRes.json();
    const goals = await goalsRes.json();

    const income = transactions
      .filter((t: any) => t.type === "income")
      .reduce((acc: number, t: any) => acc + t.amount, 0);

    const expenses = transactions
      .filter((t: any) => t.type === "expense")
      .reduce((acc: number, t: any) => acc + t.amount, 0);

    const savings = income - expenses;

    const savingsRate =
      income > 0
        ? (savings / income) * 100
        : 0;

    const totalTarget = goals.reduce(
      (acc: number, g: any) => acc + g.target_amount,
      0
    );

    const totalCurrent = goals.reduce(
      (acc: number, g: any) => acc + g.current_amount,
      0
    );

    const goalProgress =
      totalTarget > 0
        ? (totalCurrent / totalTarget) * 100
        : 0;

    let risk = "Alto";

    if (savingsRate > 50) {
      risk = "Saludable";
    } else if (savingsRate > 25) {
      risk = "Moderado";
    }

    return Response.json({
      family_diagnosis: {
        summary:
          `Ingresos: $${income.toLocaleString()} | ` +
          `Gastos: $${expenses.toLocaleString()} | ` +
          `Ahorro: $${savings.toLocaleString()}`
      },

      detected_risks: [
        `Nivel financiero: ${risk}`
      ],

      next_30_days: [
        "Controlar gastos variables",
        "Mantener disciplina de ahorro"
      ],

      next_90_days: [
        `Cumplir metas (${goalProgress.toFixed(1)}%)`,
        "Fortalecer fondo de emergencia"
      ]
    });

  } catch (error) {
    return Response.json(
      {
        error: String(error)
      },
      {
        status: 500
      }
    );
  }
}