import  axios from 'axios'

const PATH_GET_TEST_APPS = "/apis/example.com/v1/namespaces/default/testapps/";
const BASE_URL = "http://localhost:8080/";

function getTestApps(): Promise<{}> {
    return axios.get(BASE_URL + PATH_GET_TEST_APPS);
}


export const CustomApi  = {
    getTestApps
};