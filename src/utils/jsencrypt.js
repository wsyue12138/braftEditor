import JSEncrypt from 'jsencrypt';

export function encryption(publicKey,word){
	var encrypt = new JSEncrypt();
	encrypt.setPublicKey(publicKey);
	return encrypt.encrypt(word);
}
