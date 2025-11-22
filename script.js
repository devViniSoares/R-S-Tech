// ==========================================
// 1. NAVEGAÇÃO ENTRE TELAS (LOGIN / CADASTRO)
// ==========================================
const loginBox = document.getElementById('login-box');
const registerBox = document.getElementById('register-box');
const linkParaCadastro = document.getElementById('linkParaCadastro');
const linkParaLogin = document.getElementById('linkParaLogin');


linkParaCadastro.addEventListener('click', (e) => {
    e.preventDefault();
    loginBox.classList.add('hide');
    registerBox.classList.remove('hide');
});


linkParaLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerBox.classList.add('hide');
    loginBox.classList.remove('hide');
});

// ==========================================
// 2. LÓGICA DE MOSTRAR SENHA
// ==========================================
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('btnSenha');

togglePasswordBtn.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePasswordBtn.classList.remove('fa-eye');
        togglePasswordBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        togglePasswordBtn.classList.remove('fa-eye-slash');
        togglePasswordBtn.classList.add('fa-eye');
    }
});

// ==========================================
// 3. SISTEMA DE CADASTRO (Salvar no LocalStorage)
// ==========================================
const formRegister = document.getElementById('formRegister');

formRegister.addEventListener('submit', (e) => {
    e.preventDefault(); 

    
    const nome = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const senha = document.getElementById('reg-password').value;
    const confirmarSenha = document.getElementById('reg-confirm-password').value;

    
    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    
    let listaUsuarios = JSON.parse(localStorage.getItem('usuariosRS_Tech')) || [];

    
    const emailExiste = listaUsuarios.find(user => user.email === email);
    if (emailExiste) {
        alert("Este e-mail já está cadastrado!");
        return;
    }

    
    const novoUsuario = {
        nome: nome,
        email: email,
        senha: senha // Em produção real, a senha seria criptografada!
    };

    
    listaUsuarios.push(novoUsuario);
    localStorage.setItem('usuariosRS_Tech', JSON.stringify(listaUsuarios));

    alert("Cadastro realizado com sucesso! Faça login para entrar.");
    
    
    formRegister.reset();
    registerBox.classList.add('hide');
    loginBox.classList.remove('hide');
});

// ==========================================
// 4. SISTEMA DE LOGIN (Verificar no LocalStorage)
// ==========================================
const formLogin = document.getElementById('formLogin');

formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailLogin = document.getElementById('email').value;
    const senhaLogin = document.getElementById('password').value;

    
    let listaUsuarios = JSON.parse(localStorage.getItem('usuariosRS_Tech')) || [];

    
    const usuarioEncontrado = listaUsuarios.find(user => 
        user.email === emailLogin && user.senha === senhaLogin
    );

    if (usuarioEncontrado) {
        
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
        
        alert(`Bem-vindo(a), ${usuarioEncontrado.nome}!`);
        
        
        window.location.href = "index.html"; 
    } else {
        
        alert("E-mail ou senha incorretos!");
    }
});