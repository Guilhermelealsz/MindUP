import Categoria from '../models/categoria.js';

class CategoriaController {
  static async getAll(req, res) {
    try {
      const categorias = await Categoria.findAll();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { nome, descricao } = req.body;
      const id = await Categoria.create({ nome, descricao });
      res.status(201).json({ message: 'Categoria criada com sucesso', id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const categoria = await Categoria.findById(req.params.id);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { nome, descricao } = req.body;
      await Categoria.update(req.params.id, { nome, descricao });
      res.json({ message: 'Categoria atualizada com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      await Categoria.delete(req.params.id);
      res.json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default CategoriaController;
