import { db } from "../database/database.connections.js";
import { pollSchema } from "../schemas/poll.js";
import { addDays } from "../utils/days.js";



export async function createPoll(req, res) {
  const { title, expireAt } = req.body;

  try {
    // Verifica se o título da enquete foi enviado
    if (!title) {
      return res.status(422).json({ error: "O título da enquete é obrigatório" });
    }

    // Define o prazo padrão de 30 dias 
    const thirtyDaysFromNow = addDays(new Date(), 30);
    const expireAtDate = expireAt ? new Date(expireAt) : thirtyDaysFromNow;

    // Valida os dados enviados no corpo da requisição com o schema
    const { error } = pollSchema.validate({ title, expireAt: expireAtDate });
    if (error) {
      return res.status(422)
    }

    // Cria a enquete no banco de dados
    const poll = await db.collection("DrivenCracia").insertOne({ title, expireAt: expireAtDate });

    // Retorna a enquete criada com status 201 
    return res.status(201).json("Sucesso");
  } catch (error) {
    // Em caso de erro, retorna o status 500 
    return res.status(500).json({ error: error.message });
  }
}

export async function getPolls(req, res) {
    try {
      const polls = await db.collection("DrivenCracia").find().toArray();
      return res.status(200).json(polls);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar enquetes" });
    }
  }