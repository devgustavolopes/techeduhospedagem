# TechEdu Hospedagem - Servidor Local

Instruções rápidas para rodar o site localmente (pasta `public`).

Opções:

1) Usando o script npm (recomendado)

- Instale o Node (se ainda não tiver).
- Execute no terminal (na raiz do projeto):

```powershell
npm run live
```

Isso executa `npx http-server public -p 8000` e serve o conteúdo em `http://localhost:8000`.

2) Usando Python (fácil e sem dependências npm)

- Se tiver Python 3 instalado, rode na raiz do projeto:

```powershell
Push-Location "c:\caminho\para\repo\techeduhospedagem" ; python -m http.server 8000 -d public
```

- Acesse em `http://localhost:8000`.

3) Usando a extensão Live Server do VS Code

- Instale a extensão `Live Server` no VS Code.
- Abra a pasta `public` no VS Code.
- Clique com o botão direito em `index.html` e escolha "Open with Live Server".

Dicas:
- Se `npm run live` falhar com um erro de `npx` faltando, rode `npm install -g http-server` e depois `http-server public -p 8000`.
- Se houver firewall bloqueando, permita a porta 8000.

---

Se quiser, posso iniciar o servidor aqui para você testar (se me autorizar a executar comandos).