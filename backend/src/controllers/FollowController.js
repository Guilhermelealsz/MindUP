import Follow from '../models/follow.js';

class FollowController {
  static async follow(req, res) {
    try {
      const { following_id } = req.body;
      const user_id = req.user.id;

      if (user_id === following_id) {
        return res.status(400).json({ error: 'Não é possível seguir a si mesmo' });
      }

      const alreadyFollowing = await Follow.exists(user_id, following_id);
      if (alreadyFollowing) {
        return res.status(400).json({ error: 'Já está seguindo este usuário' });
      }

      const id = await Follow.create({ user_id, following_id });
      res.status(201).json({ message: 'Usuário seguido com sucesso', id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async unfollow(req, res) {
    try {
      const following_id = req.params.id;
      const user_id = req.user.id;

      await Follow.delete(user_id, following_id);
      res.json({ message: 'Deixou de seguir o usuário com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFollowers(req, res) {
    try {
      const userId = req.params.id;
      const followers = await Follow.getFollowers(userId);
      res.json(followers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFollowing(req, res) {
    try {
      const userId = req.params.id;
      const following = await Follow.getFollowing(userId);
      res.json(following);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default FollowController;
