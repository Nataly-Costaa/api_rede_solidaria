import bcrypt from 'bcrypt';

const gerar = async () => {
    const hash = await bcrypt.hash('123456', 10);
    console.log(hash);
};

gerar();