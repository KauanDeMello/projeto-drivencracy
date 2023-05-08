import { db } from "../database/database.connections.js";
import { choiceSchema } from "../schemas/choice.js";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";

export async function createChoice(req, res) {
    const { title, pollId } = req.body;
  
    try {
      const poll = await db.collection("polls").findOne({
        _id: new ObjectId(pollId),
      });
      if (!poll) {
        return res.status(404).json({ error: "Enquete não encontrada" });
      }
  
      // Verifica se a enquete já possui opções de voto
      if (!poll.choices || poll.choices.length === 0) {
        return res
          .status(403)
          .json({ error: "A enquete não possui opções de voto" });
      }
  
    
      const currentDate = new Date();
      const expireAt = new Date(poll.expireAt);
      if (currentDate > expireAt) {
        return res.status(403).json({ error: "Enquete expirada" });
      }
  
      // Valida a opção de voto
      const { error } = choiceSchema.validate({ title });
      if (error) {
        return res.status(422).json({ error: error.message });
      }
  
      // Verifica se a opção de voto já existe na enquete
      const choiceExists = poll.choices.find(
        (choice) => choice.title === title
      );
      if (choiceExists) {
        return res
          .status(409)
          .json({ error: "Title não pode ser repitido" });
      }
  
      // Adiciona a opção de voto na enquete
      const choice = { id: uuidv4(), title, votes: 0 };
      const updateResult = await db.collection("polls").updateOne(
        { _id: new ObjectId(pollId) },
        { $push: { choices: choice } }
      );
  
      if (updateResult.modifiedCount !== 1) {
        throw new Error("Não foi possível adicionar a opção de voto");
      }
  
      return res.status(201).json({ message: "Opção de voto criada com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  export async function getPollChoices(req, res) {
    const { pollId } = req.params;
  
    try {
      const poll = await db.collection("polls").findOne({
        _id: new ObjectId(pollId),
      });
      if (!poll) {
        return res.status(404).json({ error: "Enquete não encontrada" });
      }
  
      const choices = poll.choices || [];
  
      return res.status(200).json(choices);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  export async function registerVote(req, res) {
    const { pollId, choiceId } = req.params;
  
    try {
      // Verifica se a enquete existe
      const poll = await db.collection("polls").findOne({
        _id: new ObjectId(pollId),
      });
      if (!poll) {
        return res.status(404).json({ error: "Enquete não encontrada" });
      }
  
      // Verifica se a enquete já expirou
      const currentDate = new Date();
      const expireAt = new Date(poll.expireAt);
      if (currentDate > expireAt) {
        return res.status(403).json({ error: "Enquete expirada" });
      }
  
      // Busca a opção de voto selecionada na enquete
      const choice = poll.choices.find((choice) => choice.id === choiceId);
      if (!choice) {
        return res.status(404).json({ error: "Opção de voto não encontrada" });
      }
  
      // Incrementa o contador de votos da opção selecionada
      choice.votes++;
  
      // Atualiza a enquete no banco de dados
      const updateResult = await db.collection("polls").updateOne(
        { _id: new ObjectId(pollId), "choices.id": choiceId },
        { $set: { "choices.$.votes": choice.votes } }
      );
  
      if (updateResult.modifiedCount !== 1) {
        throw new Error("Não foi possível registrar o voto");
      }
  
      return res.status(201).json({ message: "Voto registrado com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }