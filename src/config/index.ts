interface Config {
  API: {
    BASE_URL: string;
    ENDPOINTS: {
      AUTH: {
        SIGNUP: string;
        LOGIN: string;
        LOGOUT: string;
      };
      USERS: {
        PROFILE: string;
      };
    };
  };
}

const config: Config = {
  API: {
    BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3010/api/v1',
    ENDPOINTS: {
      AUTH: {
        SIGNUP: '/users/onboard',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
      },
      USERS: {
        PROFILE: '/users/profile',
      },
    },
  },
};

export default config; 