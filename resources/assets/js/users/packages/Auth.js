import router from './Routes';

export default function (Vue) {

    Vue.auth = {
        //Set token
        setToken(accessToken, expiration, username,email, language, status) {
            localStorage.setItem('_user',
                JSON.stringify({
                    'token': accessToken,
                    'expiration': expiration,
                    'username': username,
                    'email': email,
                    'language': language,
                    'status': status
                }));
        },

        // Set username
        setUpdate(username, email, language, status)
        {
            const data = JSON.parse(localStorage.getItem('_user'));
            if (username !== null) {
                data.username = username;
            }
            if (language !== null) {
                data.language = language;
            }
            if (email !== null) {
                data.email = email;
            }
            if (status !== null) {
                data.status = status;
            }
            localStorage.setItem("_user", JSON.stringify(data)); //put the object back
        },

        //Destroy token
        destroyToken() {
            localStorage.removeItem('_user');
            router.push({name: 'discover'});
        },

        //Destroy token
        destroyTokenWithoutReload() {
            localStorage.removeItem('_user');
            router.push({name: 'home'});
        },

        //Get token and check it
        getCheckAuthStatus() {
            let data = JSON.parse(localStorage.getItem('_user'))
            if (data !== null) {
                if (!data.token || !data.expiration) {
                    return null;
                }

                if (Date.now() < data.expiration) {
                    this.destroyToken();
                    return null;
                }

                if (data.status == '' ||  data.status == undefined || data.status == null) {
                    return null;
                } else if (data.status == 'payment_step') {
                    return 'payment_step';
                } else if (data.status == 'payment_reactive') {
                    return 'payment_step';
                } else {
                    return 'active';
                }
            }
        },


        //Get token and check it
        getUserInfo(request){
            if (this.getCheckAuthStatus() === 'payment_step' || this.getCheckAuthStatus() === 'active') {
                const data = JSON.parse(localStorage.getItem('_user'))
                if (request === 'permission') {
                    return data.permission;
                } else if (request === 'username') {
                    return data.username;
                } else if (request === 'token') {
                    return data.token;
                }else if (request === 'email') {
                    return data.email;
                }
            }
        },

        // Check if there token
        isAuthenticated() {
            if (this.getCheckAuthStatus() == 'payment_step') {
                return 'payment_step';
            } else if (this.getCheckAuthStatus() == 'active') {
                return 'active';
            } else {
                return false;
            }

        },

    }
//make auth global
    Object.defineProperties(Vue.prototype, {
        $auth: {
            get: () => {
                return Vue.auth;
            }
        }
    });
}