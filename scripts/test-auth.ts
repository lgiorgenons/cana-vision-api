import { authService } from '../src/services';

async function main() {
  const email =
    process.env.TEST_EMAIL ?? `tester_${Date.now()}@atmos.dev`;

  console.log('Using email:', email);

  const registerResult = await authService.register({
    nome: 'Tester CLI',
    email,
    password: 'Senha123!',
    role: 'cliente',
  });
  console.log('REGISTER_OK', registerResult.user);

  const loginResult = await authService.login({
    email,
    password: 'Senha123!',
  });
  console.log(
    'LOGIN_OK',
    loginResult.tokens.accessToken.substring(0, 16) + '...',
  );
}

main().catch((err) => {
  console.error('SCRIPT_ERROR', err?.message ?? err);
  process.exit(1);
});
