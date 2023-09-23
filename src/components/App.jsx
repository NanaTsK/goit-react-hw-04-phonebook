import { Component } from 'react';
import { Container } from './index.styled';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const notifyInit = Notify.init({
  width: '280px',
  position: 'center-center',
  distance: '20px',
  opacity: 0.8,
  fontSize: '20px',
  borderRadius: '50px 10px',
  notiflixIconColor: 'rgba(0,0,0,0.6)',
  pauseOnHover: true,
});

export class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Lesya Ukrainka', number: '459-12-56' },
      { id: 'id-2', name: 'Boris JohnsonUK', number: '443-89-12' },
      { id: 'id-3', name: 'Taras Shevchenko', number: '645-17-79' },
      { id: 'id-4', name: 'Crimea BeachClub', number: '227-91-26' },
    ],
    filter: '',
  };

  componentDidMount() {
    const contacts = JSON.parse(localStorage.getItem('contacts'));
    if (contacts) {
      this.setState({ contacts: contacts });
    }
  }
  componentDidUpdate(_, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  // componentWillUnmount() {
  //   localStorage.removeItem('contacts');
  // }

  handleAddContact = newContact => {
    const isTrue = this.state.contacts.some(
      ({ name }) => name === newContact.name
    );
    if (isTrue) {
      Notify.info(
        `${newContact.name} is already in your Contact List!`,
        notifyInit
      );
      return;
    }
    this.setState(({ contacts }) => ({ contacts: [newContact, ...contacts] }));
    Notify.success(
      `${newContact.name} added to your Contact List!`,
      notifyInit
    );
  };

  getFilterContacts = () => {
    const { contacts, filter } = this.state;
    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(filter.toLowerCase().trim())
    );
  };

  removeContact = (id, name) => {
    this.setState(prev => ({
      contacts: prev.contacts.filter(contact => contact.id !== id),
    }));
    Notify.failure(`${name} removed from your Contact List!`, notifyInit);
  };

  handleFilter = ({ target: { value } }) => {
    this.setState({ filter: value });
  };

  render() {
    const filterContacts = this.getFilterContacts();
    return (
      <Container>
        <h1>Phonebook</h1>
        <ContactForm handleAddContact={this.handleAddContact} />
        <h2>Contacts</h2>
        <Filter filter={this.state.filter} handleFilter={this.handleFilter} />
        <ContactList
          contacts={filterContacts}
          removeContact={this.removeContact}
        />
      </Container>
    );
  }
}
