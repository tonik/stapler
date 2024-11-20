import { spawn } from 'child_process';

export const getShortestVercelAlias = (deploymentUrl: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const vercel = spawn('vercel', ['inspect', deploymentUrl]);

    let urls: string[] = [];

    vercel.stderr.on('data', (data) => {
      const output = data.toString();

      if (output.includes('.vercel.app')) {
        const matches = output.match(/https:\/\/[\w-]+\.vercel\.app/g);
        if (matches) {
          urls = [...urls, ...matches];
        }
      }
    });

    vercel.on('close', (code) => {
      if (code !== 0 || urls.length === 0) {
        resolve(null);
      } else {
        const shortestUrl = urls.reduce((shortest, current) => (current.length < shortest.length ? current : shortest));
        resolve(shortestUrl);
      }
    });

    vercel.on('error', () => {
      resolve(null);
    });
  });
};
