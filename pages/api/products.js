import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      res.status(200).json(data);
    }

    else if (method === 'POST') {
      const { nome, valor, quantidade, tamanho, tipo, data: dataStr } = req.body;

      // Validação mínima
      if (!nome || valor == null || quantidade == null || !tamanho || !tipo || !dataStr) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{ nome, valor, quantidade, tamanho, tipo, data: dataStr }])
        .select()
        .single();

      if (error) throw error;
      res.status(200).json(data);
    }

    else if (method === 'PUT') {
      const { id, nome, valor, quantidade, tamanho, tipo, data: dataStr } = req.body;
      if (!id) return res.status(400).json({ error: 'ID é obrigatório' });

      const updateData = { nome, valor, quantidade, tamanho, tipo, data: dataStr };

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.status(200).json(data);
    }

    else if (method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID é obrigatório' });

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.status(200).json({ message: 'Produto deletado' });
    }

    else {
      res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (err) {
    console.error('Erro na API:', err);
    res.status(500).json({ error: err.message });
  }
}
