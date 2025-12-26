const redirectToLogin = (router) => {
  router.push('/auth/login');
};

const redirectToHome= (router) => {
  router.push('/');
};

export { redirectToLogin , redirectToHome };