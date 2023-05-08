import { db } from "../database/database.connections.js";
import { pollSchema } from "../schemas/poll.js";
import { addDays } from "../utils/days.js";

export async function createPoll(req, res) {
  const { title, expireAt } = req.body;

  try {

    const poll = {title, expireAt}
    await db.collection("polls").insertOne(poll)

    // Verifica se o título não esta em branco
    if (!title) {
      return res.status(422).json({ error: "O título da enquete é obrigatório" });
    }

    // Define o prazo padrão de 30 dias
    const thirtyDaysFromNow = addDays(new Date(), 30);
    const expireAtDate = expireAt ? new Date(expireAt) : thirtyDaysFromNow;

    // Valida os dados enviados no corpo da requisição com o schema
    const { error } = pollSchema.validate({ title, expireAt: expireAtDate });
    if (error) {
      return res.status(422).json({ error: error.message });
    }

    // Retorna a enquete criada com status 201
    return res.status(201).json("Sucesso");
  } catch (error) {
    // Em caso de erro, retorna o status 500
    return res.status(500).json({ error: error.message });
  }
}

export async function getPoll(req, res) {
  try {
    const polls = await db.collection("polls").find().toArray();
    return res.status(200).json(polls);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar enquetes" });
  }
}


export async function getPollResult(req, res) {
  const pollId = req.params.id;

  try {
    const poll = await db.collection("polls").findOne({
      _id: new ObjectId(pollId),
    });
    if (!poll) {
      return res.status(404).json({ error: "Enquete não encontrada" });
    }

    const currentDate = new Date();
    const expireAt = new Date(poll.expireAt);
    if (currentDate <= expireAt) {
      return res.status(403).json({ error: "Enquete ainda não expirada" });
    }

    let mostVotedChoice = null;
    let maxVotes = -1;

    poll.choices.forEach((choice) => {
      if (choice.votes > maxVotes) {
        maxVotes = choice.votes;
        mostVotedChoice = choice;
      }
    });

    const result = {
      title: mostVotedChoice.title,
      votes: mostVotedChoice.votes,
    };

    return res.status(200).json({
      _id: poll._id,
      title: poll.title,
      expireAt: poll.expireAt,
      result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}