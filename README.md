# Transferências Financeiras - Frontend

Este projeto é a interface web para o sistema de agendamento de transferências financeiras, desenvolvido com **Angular 19**. Ele permite que o usuário realize agendamentos de transferências, visualize um extrato completo e receba feedback em tempo real sobre possíveis erros nas transações.

## 📌 Tecnologias Utilizadas

- **Angular 19**
- **TypeScript**
- **Bootstrap 5** (para estilização)
- **SCSS** (para aprimoramento visual)
- **RxJS** (para manipulação de chamadas assíncronas)
- **Date-fns** (para manipulação de datas)
- **Angular Reactive Forms** (para validação de formulários)

## ⚙️ Instalação e Execução

1. **Clone este repositório**
   ```bash
   git clone https://github.com/lucasCoelho245/frontend-transferencias.git
   ```

2. **Acesse a pasta do projeto**
   ```bash
   cd frontend-transferencias
   ```

3. **Instale as dependências**
   ```bash
   npm install
   ```

4. **Inicie o servidor Angular**
   ```bash
   npm run start
   ```

5. **Acesse no navegador**
   ```
   http://localhost:4200
   ```

## 🛠️ Funcionalidades

✅ **Cadastro de Transferências**: Permite agendar transferências preenchendo **conta de origem**, **conta de destino**, **valor**, **taxa** e **datas**.  
✅ **Validações Inteligentes**: O sistema bloqueia valores inválidos, datas incorretas e exibe mensagens de erro claras.  
✅ **Máscaras e Formatação Automática**: O sistema impede caracteres inválidos e garante que os inputs sigam os padrões corretos.  
✅ **Preenchimento Automático**: Para facilitar testes, há um botão para preencher o formulário com valores de exemplo.  
✅ **Exibição de Extrato**: O usuário pode visualizar todas as transferências cadastradas de forma clara e organizada.  
✅ **Comunicação com o Backend**: A interface faz requisições HTTP para a API, garantindo que os dados estejam sincronizados.  
✅ **Botao de Delete**: Para melhor controle dos registros, há um botão com capacidade de deletar o resgistro escolhido.


## 🌟 Layout e Design

O projeto foi desenvolvido utilizando **Bootstrap 5** e **SCSS**, proporcionando uma interface responsiva e agradável ao usuário. O formulário é intuitivo, com mensagens de erro bem definidas, e a tabela de extrato é estilizada para melhor visualização.

## 🔗 API Backend

O frontend se comunica com a API backend desenvolvida em **Java Spring Boot**. Para garantir a funcionalidade completa, certifique-se de que o backend esteja rodando corretamente.

- **Endpoint da API:** `http://localhost:8081/transferencias`
- **Métodos disponíveis:**
  - `GET /transferencias` → Retorna a lista de transferências cadastradas.
  - `POST /transferencias` → Realiza um novo agendamento de transferência.

## 🚀 Como Testar

Para garantir que o sistema esteja funcionando corretamente, siga estas etapas:

1. **Teste de cadastro de transferência**
  - Tente criar uma transferência com dados válidos e verifique se ela aparece no extrato.
  - Utilize o botão de preenchimento automático para facilitar os testes.

2. **Teste de validações**
  - Insira **contas com menos de 10 dígitos** ou **caracteres não numéricos** e veja se o erro aparece.
  - Digite **datas fora do limite permitido** (acima de 50 dias) e confira a mensagem de erro.
  - Teste **valores negativos ou zerados** para verificar a validação.

3. **Teste de comunicação com o backend**
  - Confirme que a API backend está rodando (`http://localhost:8081/transferencias`).
  - Verifique no **Postman** se as requisições `GET` e `POST` funcionam corretamente.

## 🐝 Licença

Este projeto foi desenvolvido para fins de avaliação técnica. Todos os direitos reservados.

---
💡 **Dica**: Certifique-se de configurar corretamente o backend antes de testar o frontend!
