import config  from "../config";
import { UNIVERSITY_CERTIFICATE } from "../util/hsConstants"
const issuerStore = {
    namespaced: true,
    state:{
        accessToken:null,
        issuedVC:null,       
        didDoc:null,
        schema:null,
        selectedSchemaType:null,
        adminArray:[]

    },
    getters:{
        getEntityHeader: (state) => {
            return {
              "Content-Type": "application/json",
              Authorization: "Bearer " + state.accessToken,
            };
        },
        getSelectedSchemaType: (state) => {          
          return state.selectedSchemaType;
        }
    },
    mutations: {
        setEntityAccessToken(state, payload) {
          state.accessToken = payload;
        },
        setDIDDoc(state,payload) {
          state.didDoc = payload
        },
        setVCToStore(state,payload) {
          state.issuedVC = payload
        },
        setSchemaToStore(state,payload) {
          state.schema = payload
        },
        setSelectedSchemaType(state,payload) {
          state.selectedSchemaType = payload
        },
        addAdminToStore(state,payload) {
          state.adminArray.push(payload)
        },
        setAdminArray(state,payload) {
          state.adminArray = [...payload]
        }
    },
    actions:{
        authenticateEntity: ({ commit }) => {
            return new Promise((resolve, reject) => {
              try {
                const url = config.baseUrl + "/api/v1/app/oauth";
                fetch(url, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Api-Secret-Key": config.apiSecret,
                  },
                })
                  .then((resp) => {
                    return resp.json();
                  })
                  .then((json) => {
                    if (json.statusCode == 400) {
                      throw new Error("Bad Request" + json.message.toString());
                    }
                    if (json.statusCode == 401) {
                      throw new Error("Invalid API Secret Key");
                    }
                    const { access_token } = json;
                    commit("setEntityAccessToken", access_token);
                    resolve(json);
                  });
              } catch (error) {
                reject(error);
              }
            });
          },
          generateDIDDoc:({commit,getters}) => {
            return new Promise((resolve,reject) => {
                try {
                    const url = config.baseUrl + "/api/v1/did/create"
                    const body = {
                        namespace:"testnet"
                    }
                    fetch(url, {
                        method: "POST",
                        headers: getters.getEntityHeader,
                        body: JSON.stringify(body)
                    })
                    .then((resp) => {
                        return resp.json()
                    })
                    .then((json) => {
                        console.log(json)
                        commit("setDIDDoc",json.metaData.didDocument)
                        resolve(json)
                    })
                } catch (error) {
                    reject(error)
                }
            })
          },
          issueCredential: ({ state,getters, commit }, payload) => {
            console.log(payload)      
            return new Promise((resolve, reject) => {
              try {
                const url = config.baseUrl + "/api/v1/credential/issue";
                const body = {
                  schemaId:UNIVERSITY_CERTIFICATE,
                  subjectDid: state.didDoc.id,
                  // issuerDid:"did:hid:testnet:zHfG5jtCiZLarsiPENH4LZ1u9uUfCWpiXicWshJFZQXTn",
                  issuerDid:"did:hid:testnet:zEpzGmuC9sYBGtWZkv1aN4j3X44B9smiFBWW7brgCqEku",
                  expirationDate: "2027-12-10T18:30:00.000Z",
                  fields: payload,
                  namespace: "testnet",
                  verificationMethodId:"did:hid:testnet:zEpzGmuC9sYBGtWZkv1aN4j3X44B9smiFBWW7brgCqEku#key-1",
                  persist: true,
                };
                fetch(url, {
                  method: "POST",
                  headers: getters.getEntityHeader,
                  body: JSON.stringify(body),
                })
                  .then((resp) => {
                    return resp.json();
                  })
                  .then((json) => {
                    if (json.statusCode == 400) {
                      throw new Error("Bad Request" + json.message.toString());
                    }                    
                    commit("setVCToStore",json.credentialDocument)
                    resolve(json);
                  });
              } catch (error) {
                reject(error);
              }
            });
          },
          resolveSchema: ({ getters, commit }) => {
            console.log('in resolve schema');
            // const schemaId = "sch:hid:testnet:z24dW4XUfgnqvEekHtr13Zfn6dx1M8Ubp4G6nMYmSYWkW:1.0";
            const schemaId = getters.getSelectedSchemaType.schemaId
            const url = config.baseUrl + `/api/v1/schema/${schemaId}`;
          
            return new Promise((resolve, reject) => {
              fetch(url, {
                method: "GET",
                headers: getters.getEntityHeader,
              })
              .then((resp) => {
                if (!resp.ok) {
                  throw new Error(`HTTP Error: ${resp.status} ${resp.statusText}`);
                }
                return resp.json();
              })
              .then((json) => {
                console.log(json);
                commit("setSchemaToStore", json);
                resolve(json);
              })
              .catch((error) => {
                console.error(error);
                reject(error);
              });
            });
          },
          addAdmin: ({commit},payload) => {
            return new Promise((resolve,reject) => {
              try {
                const url = 'http://localhost:3000/add/teammate'              
                const header = {
                  "Content-type": "application/json",
                }
                fetch(url,{
                  method:'POST',
                  headers:header,
                  body:JSON.stringify(payload)
                })
                .then((res) => {
                  return res.json()
                }).then((json)=>{
                  console.log(json)
                  commit("addAdminToStore",json)
                  resolve(json)
                });
              } catch (error) {
                reject(error)
              }
            })
          },
          getAllAdmin:({commit}) => {
            return new Promise((resolve,reject) => {
              try {
                const header = {
                  "Content-type": "application/json",
                }
                const url = 'http://localhost:3000/get/allTeammate'
                fetch(url,{
                  method:'GET',
                  headers:header
                })
                .then((resp) => {
                  return resp.json()
                })
                .then((json) => {
                  console.log(json)
                  commit("setAdminArray",json)
                  resolve(json)
                })
              } catch (error) {
                console.log(error)
                reject(error)
              }
            })
          }
          
    }
}

export default issuerStore;