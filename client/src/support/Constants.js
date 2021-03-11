const BACKEND = 'http://localhost:8000'

const Strings = {
  'goToHomePage': {
    ru: 'Вернуться на главную страницу',
    en: 'Go to home page',
    jp: 'ホームページへ'
  },
  'error404PageNotFound': {
    ru: 'Ошибка 404. Страница не найдена',
    en: 'Error 404. Page not found',
    jp: ''
  },
  'home': {
    ru: 'Главная',
    en: 'Home',
    jp: ''
  },
  'notFound': {
    ru: 'Не найдено',
    en: 'Not Found',
    jp: ''
  },
  'youAreBanned': {
    ru: 'Вы забанены',
    en: 'You are banned',
    jp: ''
  },
  'users': {
    ru: 'Пользователи',
    en: 'Users',
    jp: ''
  },
  'newest': {
    ru: 'Новые',
    en: 'Newest',
    jp: ''
  },
  'oldest': {
    ru: 'Старые',
    en: 'Oldest',
    jp: ''
  },
  'online': {
    ru: 'Онлайн',
    en: 'Online',
    jp: ''
  },
  'noUsersYet': {
    ru: 'Пока нет пользователей',
    en: 'No users yet',
    jp: ''
  },
  'unableToDisplayUsers': {
    ru: 'Невозможно отобразить пользователей',
    en: 'Unable to display users',
    jp: ''
  },
  'profile': {
    ru: 'Профиль',
    en: 'Profile',
    jp: ''
  },
  'lastSeen': {
    ru: 'Был в онлайн',
    en: 'Last seen',
    jp: ''
  },
  'settings': {
    ru: 'Настройки',
    en: 'Settings',
    jp: ''
  },
  'unableToDisplayUserProfile': {
    ru: 'Невозможно отобразить профиль',
    en: 'Unable to display user profile',
    jp: ''
  },
  'profileSettings': {
    ru: 'Настройки профиля',
    en: 'Profile settings',
    jp: ''
  },
  'uploadProfilePicture': {
    ru: 'Загрузка изображения профиля',
    en: 'Upload profile picture',
    jp: ''
  },
  'accepted': {
    ru: 'Разрешены',
    en: 'Accepted',
    jp: ''
  },
  'maxFilesCount': {
    ru: 'Максимальное количество файлов',
    en: 'Max files count',
    jp: ''
  },
  'maxSize': {
    ru: 'Максимальный размер',
    en: 'Max size',
    jp: ''
  },
  'upload': {
    ru: 'Загрузка',
    en: 'Upload',
    jp: ''
  },
  'popularBoards': {
    ru: 'Популярные доски',
    en: 'Popular boards',
    jp: ''
  },
  'all': {
    ru: 'Все',
    en: 'All',
    jp: ''
  },
  'recentlyThreads': {
    ru: 'Недавние треды',
    en: 'Recently threads',
    jp: ''
  },
  'noThreadsYet': {
    ru: 'Пока нет тредов',
    en: 'No threads yet',
    jp: ''
  },
  'filesUploads': {
    ru: 'Файлы/Загрузки',
    en: 'Files/Uploads',
    jp: ''
  },
  'noUploadsYet': {
    ru: 'Пока нет загрузок',
    en: 'No uploads yet',
    jp: ''
  },
  'thread': {
    ru: 'Тред',
    en: 'Thread',
    jp: ''
  },
  'allBoards': {
    ru: 'Все доски',
    en: 'All boards',
    jp: ''
  },
  'error': {
    ru: 'Ошибка',
    en: 'Error',
    jp: ''
  },
  'threadNotFound': {
    ru: 'Тред не найден',
    en: 'Thread not found',
    jp: ''
  },
  'noAnswersYet': {
    ru: 'Пока нет ответов',
    en: 'No answers yet',
    jp: ''
  },
  'boards': {
    ru: 'Доски',
    en: 'Boards',
    jp: ''
  },
  'default': {
    ru: 'По умолчанию',
    en: 'Default',
    jp: ''
  },
  'popular': {
    ru: 'Популярные',
    en: 'Popular',
    jp: ''
  },
  'recentlyAnswered': {
    ru: 'Недавно отвеченные',
    en: 'Recently answered',
    jp: ''
  },
  'byNewestThread': {
    ru: 'По новизне',
    en: 'By newest',
    jp: ''
  },
  'byAnswersCount': {
    ru: 'По числу ответов',
    en: 'By answers count',
    jp: ''
  },
  'noBoardsYet': {
    ru: 'Пока нет досок',
    en: 'No boards yet',
    jp: ''
  },
  'unableToDisplayBoards': {
    ru: 'Невозможно отобразить доски',
    en: 'Unable to display boards',
    jp: ''
  },
  'board': {
    ru: 'Доска',
    en: 'Board',
    jp: ''
  },
  'recentlyAnswered': {
    ru: '',
    en: 'Recently answered',
    jp: ''
  },
  'unableToDisplayBoard': {
    ru: 'Невозможно отобразить доску',
    en: 'Unable to display board',
    jp: ''
  },
  'unableToDisplayThreads': {
    ru: 'Невозможно отобразить треды',
    en: 'Unable to display threads',
    jp: ''
  },
  'adminDashboard': {
    ru: 'Панель администратора',
    en: 'Admin dashboard',
    jp: ''
  },
  'dashboard': {
    ru: 'Панель управления',
    en: 'Dashboard',
    jp: ''
  },
  'admins': {
    ru: 'Администраторы',
    en: 'Admins',
    jp: ''
  },
  'reports': {
    ru: 'Жалобы',
    en: 'Reports',
    jp: ''
  },
  'bans': {
    ru: 'Баны',
    en: 'Bans',
    jp: ''
  },
  'manageBoards': {
    ru: 'Управление досками',
    en: 'Manage boards',
    jp: ''
  },
  'createNewBoard': {
    ru: 'Создать новую доску',
    en: 'Create new board',
    jp: ''
  },
  'enterShortName': {
    ru: 'Введите короткое имя',
    en: 'Enter short name',
    jp: ''
  },
  'enterTitle': {
    ru: 'Введите название',
    en: 'Enter title',
    jp: ''
  },
  'enterPosition': {
    ru: 'Введите позицию',
    en: 'Enter position',
    jp: ''
  },
  'thread1': {
    ru: 'треда',
    en: 'thread',
    jp: ''
  },
  'thread2': {
    ru: 'треда',
    en: 'threads',
    jp: ''
  },
  'thread3': {
    ru: 'тредов',
    en: 'threads',
    jp: ''
  },
  'answer1': {
    ru: 'ответ',
    en: 'answer',
    jp: ''
  },
  'answer2': {
    ru: 'ответа',
    en: 'answers',
    jp: ''
  },
  'answer3': {
    ru: 'ответов',
    en: 'answers',
    jp: ''
  },
  'boardShortName': {
    ru: 'Короткое имя доски',
    en: 'Board short name',
    jp: ''
  },
  'boardTitle': {
    ru: '',
    en: 'Board title',
    jp: ''
  },
  'boardDescription': {
    ru: 'Описание доски',
    en: 'Board description',
    jp: ''
  },
  'enterDescription': {
    ru: 'Ведите описание',
    en: 'Enter description',
    jp: ''
  },
  'boardPosition': {
    ru: 'Позиция доски',
    en: 'Boards position',
    jp: ''
  },
  'save': {
    ru: 'Сохранить',
    en: 'Save',
    jp: ''
  },
  'create': {
    ru: 'Создать',
    en: 'Create',
    jp: ''
  },
  'cancel': {
    ru: 'Отменить',
    en: 'Cancel',
    jp: ''
  },
  'noBansYet': {
    ru: 'Пока нет банов',
    en: 'No bans yet',
    jp: ''
  },
  'unableToDisplayBans': {
    ru: 'Невозможно отобразить баны',
    en: 'Unable to display bans',
    jp: ''
  },
  'signIn': {
    ru: 'Войти',
    en: 'Sign In',
    jp: ''
  },
  'enterYourName': {
    ru: 'Введите свой логин',
    en: 'Enter your name',
    jp: ''
  },
  'enterPassword': {
    ru: 'Введите пароль',
    en: 'Enter password',
    jp: ''
  },
  'logInAccount': {
    ru: 'Войти в аккаунт',
    en: 'Login account',
    jp: ''
  },
  'username': {
    ru: 'Логин',
    en: 'Username',
    jp: ''
  },
  'password': {
    ru: 'Пароль',
    en: 'Password',
    jp: ''
  },
  'or': {
    ru: 'Или',
    en: 'Or',
    jp: ''
  },
  'ifYouDontHaveAnAccount': {
    ru: 'если у вас нет аккаунта',
    en: 'if you don\'t have an account',
    jp: ''
  },
  'signUp': {
    ru: 'Регистрация',
    en: 'Sign Up',
    jp: ''
  },
  'enterEmail': {
    ru: 'Введите email',
    en: 'Enter email',
    jp: ''
  },
  'passwordsNotMatch': {
    ru: 'пароли не совпадают',
    en: 'Passwords not match',
    jp: ''
  },
  'createYourAccount': {
    ru: 'Создать учетную запись',
    en: 'Create your account',
    jp: ''
  },
  'emailAddress': {
    ru: 'Адрес электронной почты',
    en: 'Email address',
    jp: ''
  },
  'confirmPassword': {
    ru: 'Подтверждение пароля',
    en: 'Confirm password',
    jp: ''
  },
  'createAccount': {
    ru: 'Зарегистрироваться',
    en: 'Create account',
    jp: ''
  },
  'ifYouAlreadyHaveAnAccount': {
    ru: 'если у вас уже есть аккаунт',
    en: 'if you already have an account',
    jp: ''
  },
  'enterThreadTitle': {
    ru: 'Введите название треда',
    en: 'Enter thread title',
    jp: ''
  },
  'enterContent': {
    ru: 'Введите содержание',
    en: 'Enter content',
    jp: ''
  },
  'chooseFromList': {
    ru: 'Выберите из списка',
    en: 'Choose from list',
    jp: ''
  },
  'boardsNotLoaded': {
    ru: 'Доски не загружены',
    en: 'Boards not loaded',
    jp: ''
  },
  'enterReason': {
    ru: 'Введите причину',
    en: 'Enter reason',
    jp: ''
  },
  'enterDate': {
    ru: 'Введите дату',
    en: 'Enter date',
    jp: ''
  },
  'newThread': {
    ru: 'Новый тред',
    en: 'New thread',
    jp: ''
  },
  'threadTitle': {
    ru: 'Заголовок треда',
    en: 'Thread title',
    jp: ''
  },
  'content': {
    ru: 'Содержание',
    en: 'Content',
    jp: ''
  },
  'chooseABoard': {
    ru: 'Выберите доску',
    en: 'Choose a board',
    jp: ''
  },
  'select': {
    ru: 'Выберите',
    en: 'Select',
    jp: ''
  },
  'loading': {
    ru: 'Загрузка',
    en: 'Loading',
    jp: ''
  },
  'createThread': {
    ru: 'Создать тред',
    en: 'Create thread',
    jp: ''
  },
  'answerInThread': {
    ru: 'Ответить в тред',
    en: 'Answer in thread',
    jp: ''
  },
  'answer': {
    ru: 'Ответить',
    en: 'Answer',
    jp: ''
  },
  'editAnswer': {
    ru: 'Редактировать ответ',
    en: 'Edit answer',
    jp: ''
  },
  'edit': {
    ru: 'Редактировать',
    en: 'Edit',
    jp: ''
  },
  'editThread': {
    ru: 'Редактировать тред',
    en: 'Edit thread',
    jp: ''
  },
  'banUser': {
    ru: 'Забанить пользователя',
    en: 'Ban user',
    jp: ''
  },
  'reason': {
    ru: 'Причина',
    en: 'Reason',
    jp: ''
  },
  'banDuration': {
    ru: 'Продолжительность бана',
    en: 'Ban duration',
    jp: ''
  },
  'ban': {
    ru: 'Забанить',
    en: 'Ban',
    jp: ''
  },
  'createNew': {
    ru: 'рздать тред',
    en: 'Create new',
    jp: ''
  },
  'messages': {
    ru: 'Сообщения',
    en: 'Messages',
    jp: ''
  },
  'rules': {
    ru: 'Правила',
    en: 'Rules',
    jp: ''
  },
  'enterForSearch': {
    ru: 'Введите для поиска',
    en: 'Enter for search',
    jp: ''
  },
  'noNotificationYet': {
    ru: 'Уведомлений пока нет',
    en: 'No notification yet',
    jp: ''
  },
  'deleteAllNotifications': {
    ru: 'Удалить все уведомления',
    en: 'Delete all notifications',
    jp: ''
  },
  'unableToDisplayNotifications': {
    ru: 'Невозможно отобразить уведомления',
    en: 'Unable to display notifications',
    jp: ''
  },
  'openProfile': {
    ru: 'Открыть профиль',
    en: 'Open profile',
    jp: ''
  },
  'language': {
    ru: 'Язык',
    en: 'Language',
    jp: ''
  },
  'toggleTheme': {
    ru: 'Переключить тему',
    en: 'Toggle theme',
    jp: ''
  },
  'logout': {
    ru: 'Выйти',
    en: 'Logout',
    jp: ''
  },
  '': {
    ru: '',
    en: '',
    jp: ''
  },
  '': {
    ru: '',
    en: '',
    jp: ''
  },
  '': {
    ru: '',
    en: '',
    jp: ''
  },
  '': {
    ru: '',
    en: '',
    jp: ''
  },
  '': {
    ru: '',
    en: '',
    jp: ''
  },
  '': {
    ru: '',
    en: '',
    jp: ''
  },
  '': {
    ru: '',
    en: '',
    jp: ''
  },
  '': {
    ru: '',
    en: '',
    jp: ''
  },vvv
  '': {
    ru: '',
    en: '',
    jp: ''
  },
  '': {
    ru: '',
    en: '',
    jp: ''
  },
  '': {
    ru: '',
    en: '',
    jp: ''
  },
  '': {
    ru: '',
    en: '',
    jp: ''
  },
  '': {
    ru: '',
    en: '',
    jp: ''
  },
  '': {
    ru: '',
    en: '',
    jp: ''
  },
}

export { BACKEND, Strings };
