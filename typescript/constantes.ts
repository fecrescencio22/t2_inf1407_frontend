// DEV: http://127.0.0.1:8000/   PROD: https://<seu-backend>/
const backendAddress = 'http://127.0.0.1:8000/';

interface Link {
  id: number;
  owner: string;
  original_url: string;
  short_code: string;
  created_at: string;
  updated_at: string;
  access_count: number;
}

interface JwtResposta {
  access: string;
  refresh: string;
}

interface WhoAmI {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}
