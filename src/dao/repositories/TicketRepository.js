import TicketModel from '../../dao/models/TicketModel.js';

const generateTicketCode = () => `T-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

class TicketRepository {
  async createTicket({ amount, purchaser, products }) {
    const ticket = await TicketModel.create({
      code: generateTicketCode(),
      amount,
      purchaser,
      products
    });
    return ticket;
  }
}

export default TicketRepository;