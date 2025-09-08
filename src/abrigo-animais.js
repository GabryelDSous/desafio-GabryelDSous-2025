// Criando a lista dos animais com seus brinquedos seguindo a ordem do desafio
const ANIMAIS = {
  Rex: { tipo: 'Cão', brinquedos: ['RATO', 'BOLA'] },
  Mimi: { tipo: 'Gato', brinquedos: ['BOLA', 'LASER'] },
  Fofo: { tipo: 'Gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
  Zero: { tipo: 'Gato', brinquedos: ['RATO', 'BOLA'] },
  Bola: { tipo: 'Cão', brinquedos: ['CAIXA', 'NOVELO'] },
  Bebe: { tipo: 'Cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
  Loco: { tipo: 'Jabuti', brinquedos: ['SKATE', 'RATO'] },
};
// Lista com os brinquedos(sem repetição) para futuras validações
const BRINQUEDOS_VALIDOS = new Set(Object.values(ANIMAIS).flatMap(b => b.brinquedos))

class AbrigoAnimais {
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    // Esse método vai coletar o nome dos brinquedos e a ordem dos animais das strings passadas
    const parseList = (s) => (s || '')
    .split(',')
    .map(i => i.trim())
    .filter(i => i.length > 0)

    const p1 = parseList(brinquedosPessoa1)
    const p2 = parseList(brinquedosPessoa2)
    const ordem = parseList(ordemAnimais)

    // Método de verificação de brinquedos duplicados ou se o brinquedo existe dentro da lista de brinquedo dos animais
    const verificarDuplicados = (arr) => new Set(arr).size !== arr.length
    const verificarInvalidos = (arr) => arr.find(t => !BRINQUEDOS_VALIDOS.has(t))
    if(verificarDuplicados(p1) || verificarDuplicados(p2) ||
      verificarInvalidos(p1) || verificarInvalidos(p2))
      return {erro: 'Brinquedo Inválido'}

    // caso de não passarem um animal, não é um erro, mas também não tem adoção
    if(ordem === 0)
      return {lista:[], erro:null}

    // Verificar se o animal passado pela pessoa existe ou não
    const animalInvalido = ordem.find(nome => !ANIMAIS.hasOwnProperty(nome))
    if(animalInvalido)
      return {erro:"Animal Inválido"}
    if(new Set(ordem).size !== ordem.length)
      return {erro:"Animal Inválido"}

    // Verificar se os brinquedos das pessoas são os que o animal gosta, e se estão na ordem
    const subsequenciaBrinquedos = (list, pattern) =>{
      if(pattern.length === 0) return true
      let i = 0
      for(const item of list){
        if(item === pattern[i]) i++
        if(i === pattern.length) return true
      }
      return false
    }
    // Aqui eu vou verificar apenas se os brinquedos que a pessoa tem é o mesmo que o animal gosta
    const brinquedosExistem = (list, pattern) =>{
      const set = new Set(list)
      return pattern.every(p => set.has(p))
    }

    let adotado1 = 0
    let adotado2 = 0
    let resultadoMap = {}

    for(const nome of ordem){
      const animal = ANIMAIS[nome] // aqui eu to pegando as informações do animal pelo nome passado pela pessoa
      const brinquedosAnimal = animal.brinquedos // e aqui pegando os brinquedos do animal

      // verificando se a pessoa 1 pode adotar
      const p1Pode = (()=>{
        if(adotado1 >= 3) return false
        if(nome === 'Loco'){
          if(adotado1 > 0){
            return brinquedosExistem(p1, brinquedosAnimal)
          }
          return subsequenciaBrinquedos(p1. brinquedosAnimal)
        }
        return subsequenciaBrinquedos(p1, brinquedosAnimal)
      })()
      // verificando se a pessoa 2 pode adotar
      const p2Pode = (()=>{
        if(adotado2 >= 3) return false
        if(nome === 'Loco'){
          if(adotado2 > 0){
            return brinquedosExistem(p2, brinquedosAnimal)
          }
          return subsequenciaBrinquedos(p2, brinquedosAnimal)
        }
        return subsequenciaBrinquedos(p2, brinquedosAnimal)
      })()

      // Enviando os animais
      if(p1Pode && p2Pode){
        resultadoMap[nome] = 'Abrigo'
        continue
      }
      if(p1Pode){
        resultadoMap[nome] = 'Pessoa 1'
        adotado1++
        continue
      }
      if(p2Pode){
        resultadoMap[nome] = 'Pessoa 2'
        adotado2++
        continue
      }

      resultadoMap[nome] = "Abrigo"
    }
    const lista = ordem
    .map(nome => ({nome, destino: resultadoMap[nome]}))
    .sort((a,b) => a.nome.localeCompare(b.nome))
    .map(item => `${item.nome} - ${item.destino}`)
    
    return {lista, erro:null}
  }
}

export { AbrigoAnimais as AbrigoAnimais };
