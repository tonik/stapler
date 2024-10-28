import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, error } = await supabase.from('your_table').select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
};

export default handler;
