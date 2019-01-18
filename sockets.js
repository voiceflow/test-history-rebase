const {redisClient, verify} = require('./services')

module.exports = (io) => {

io.on('connection', (socket) => {
    socket.ip = socket.client.request.headers['cf-connecting-ip']

    const fail = () => {
        socket.emit('fail')
    }

    socket.on('handshake', data => {
        if(!(data.auth && data.device)){
            return fail()
        }

        socket.device = data.device

        // verify the user's login token
        verify(data.auth, data =>{
            if(!data){
                return fail()
            }

            // check if there is an existing socket session already
            redisClient.get(`s_${data.user.id}`, (err, session) => {
                if(err){
                    console.trace(err)
                    return fail()
                }else if(session && session !== socket.id){
                    let connected = io.sockets.connected[session]
                    if(connected){
                        return socket.emit('in_use', {
                            device: socket.device,
                            ip: socket.ip ? socket.ip : 'localhost'
                        })
                    }
                }

                // no existing sessions create new one
                redisClient.set(`s_${data.user.id}`, socket.id, err => {
                    if(err){
                        console.trace(err)
                        return fail()
                    }

                    socket.account = data.user
                    socket.emit('verified')
                })
            })
        })
    })

    socket.on('disconnect', () => {
        if(socket.account){
            redisClient.get(`s_${socket.account.id}`, (err, session) => {
                if(!err && session && session === socket.id){
                    redisClient.del(`s_${socket.account.id}`)
                }
            })
        }
    })
})

}