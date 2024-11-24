const mongoose = require('mongoose');
const Notification = require('./Models/NotificationModel');

const seedNotifications = async () => {
  try {
    await mongoose.connect('mongodb+srv://bhuvaneshg:deepakbhuvi@cluster0.e2m47pj.mongodb.net/SIH', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const notifications = [
      {
        patientId: '673de310173bfb0272228fc8', // Mason Scott
        title: 'Welcome Reminder',
        date: new Date('2024-11-25'),
        time: '9:00 AM',
        content: 'Hi Mason Scott, remember to complete your wellness assessment.',
      },
      {
        patientId: '673de310173bfb0272228fc9', // Harper King
        title: 'Session Reminder',
        date: new Date('2024-11-26'),
        time: '3:00 PM',
        content: 'Hi Harper King, your first therapy session is scheduled for 3 PM.',
      },
      {
        patientId: '673de310173bfb0272228fca', // Aiden Wright
        title: 'System Update',
        date: new Date('2024-11-24'),
        time: '10:00 AM',
        content: 'Hi Aiden Wright, a system update will be performed on November 24th.',
      },
      {
        patientId: '673de310173bfb0272228fcb', // Charlotte Lee
        title: 'Therapy Goals',
        date: new Date('2024-11-27'),
        time: '11:00 AM',
        content: 'Hi Charlotte Lee, set your therapy goals for a successful session.',
      },
      {
        patientId: '673de310173bfb0272228fcc', // Liam Walker
        title: 'Session Summary',
        date: new Date('2024-11-28'),
        time: '5:00 PM',
        content: 'Hi Liam Walker, your session summary is now available.',
      },
      {
        patientId: '673de310173bfb0272228fcd', // Amelia Harris
        title: 'Progress Update',
        date: new Date('2024-11-29'),
        time: '1:00 PM',
        content: 'Hi Amelia Harris, check your progress and plan your next session.',
      },
    ];

    // Clear the existing notifications collection (optional)
    await Notification.deleteMany();

    // Insert new notifications
    await Notification.insertMany(notifications);
    console.log('Notifications added successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding notifications:', error);
    process.exit(1);
  }
};

seedNotifications();
