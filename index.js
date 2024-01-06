const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())

const orderItems = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orderItems.findIndex((order) => order.id === id)

    if(index < 0) {
        return response.status(404).json({error: 'Order not found.'})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const showDetails = (request, response, next) => {
    const fullUrl = `${request.protocol}://${request.hostname}:${request.socket.localPort}${request.originalUrl}`
    
    console.log(
    `Método da requisição: ${request.method},
URL da reuisição: ${fullUrl}`)

    next()
}

app.post('/order', showDetails, (request, response) => {
    const { order, clientName, price } = request.body
    const orders = { id: uuid.v4(), order, clientName, price, status: 'Em preparação' }

    orderItems.push(orders)

    return response.status(201).json(orderItems)
})

app.get('/order', showDetails,(request, response) => {
    return response.json(orderItems)
})

app.put('/order/:id', showDetails, checkOrderId, (request, response) => {
    console.log(request)
    const { order, clientName, price } = request.body

    const id = request.orderId

    const updatedOrder = { id, order, clientName, price, status: 'Em preparação'}

    const index = request.orderIndex

    orderItems[index] = updatedOrder

    return response.json(updatedOrder)
})

app.delete('/order/:id', showDetails, checkOrderId, (request, response) => {
    const index = request.orderIndex

    orderItems.splice(index,1)

    return response.status(204).json()
})

app.get('/order/:id', showDetails, checkOrderId, (request, response) => {
    const index = request.orderIndex

    const filteredOrder = orderItems.slice(index, index + 1) [0]
    
    return response.json(filteredOrder)
})

app.patch('/order/:id', showDetails, checkOrderId, (request, response) => {
    const index = request.orderIndex

    const changeStatus = orderItems[index]

    changeStatus.status = 'Pronto'

    orderItems[index] = changeStatus

    return response.json(changeStatus)
})












app.listen(port, () => {
    console.log(`💻 Server is running on port ${port} 💻`)
})