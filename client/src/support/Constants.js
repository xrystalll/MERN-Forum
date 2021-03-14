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
    jp: 'エラー404ページが見つかりません'
  },
  'home': {
    ru: 'Главная',
    en: 'Home',
    jp: 'ホームページ'
  },
  'notFound': {
    ru: 'Не найдено',
    en: 'Not Found',
    jp: '見つかりません'
  },
  'youAreBanned': {
    ru: 'Вы забанены',
    en: 'You are banned',
    jp: 'あなたは禁止されています'
  },
  'users': {
    ru: 'Пользователи',
    en: 'Users',
    jp: 'ユーザー'
  },
  'newest': {
    ru: 'Новые',
    en: 'Newest',
    jp: '最新'
  },
  'oldest': {
    ru: 'Старые',
    en: 'Oldest',
    jp: '最古'
  },
  'online': {
    ru: 'Онлайн',
    en: 'Online',
    jp: 'オンライン'
  },
  'noUsersYet': {
    ru: 'Пока нет пользователей',
    en: 'No users yet',
    jp: 'まだユーザーはいません'
  },
  'noAdminsYet': {
    ru: 'Пока нет админов',
    en: 'No admins yet',
    jp: 'まだ管理者はいません'
  },
  'unableToDisplayUsers': {
    ru: 'Невозможно отобразить пользователей',
    en: 'Unable to display users',
    jp: 'ユーザーを表示できません'
  },
  'profile': {
    ru: 'Профиль',
    en: 'Profile',
    jp: 'プロフィール'
  },
  'lastSeen': {
    ru: 'Был в онлайн',
    en: 'Last seen',
    jp: '最後に見た'
  },
  'settings': {
    ru: 'Настройки',
    en: 'Settings',
    jp: '設定'
  },
  'unableToDisplayUserProfile': {
    ru: 'Невозможно отобразить профиль',
    en: 'Unable to display user profile',
    jp: 'ユーザープロフィールを表示できません'
  },
  'profileSettings': {
    ru: 'Настройки профиля',
    en: 'Profile settings',
    jp: 'プロフィール設定'
  },
  'uploadProfilePicture': {
    ru: 'Загрузка изображения профиля',
    en: 'Upload profile picture',
    jp: 'プロフィール画像'
  },
  'accepted': {
    ru: 'Разрешены',
    en: 'Accepted',
    jp: '承認済み'
  },
  'maxFilesCount': {
    ru: 'Максимальное количество файлов',
    en: 'Max files count',
    jp: '最大ファイル数'
  },
  'maxSize': {
    ru: 'Максимальный размер',
    en: 'Max size',
    jp: '最大サイズ'
  },
  'upload': {
    ru: 'Загрузка',
    en: 'Upload',
    jp: 'アップロード'
  },
  'popularBoards': {
    ru: 'Популярные доски',
    en: 'Popular boards',
    jp: '人気のボード'
  },
  'all': {
    ru: 'Все',
    en: 'All',
    jp: 'すべて'
  },
  'recentlyThreads': {
    ru: 'Недавние треды',
    en: 'Recently threads',
    jp: '最近のスレッド'
  },
  'noThreadsYet': {
    ru: 'Пока нет тредов',
    en: 'No threads yet',
    jp: 'スレッドはまだありません'
  },
  'filesUploads': {
    ru: 'Файлы/Загрузки',
    en: 'Files/Uploads',
    jp: 'ファイル/アップロード'
  },
  'noUploadsYet': {
    ru: 'Пока нет загрузок',
    en: 'No uploads yet',
    jp: 'まだアップロードはありません'
  },
  'thread': {
    ru: 'Тред',
    en: 'Thread',
    jp: 'スレッド'
  },
  'allBoards': {
    ru: 'Все доски',
    en: 'All boards',
    jp: 'すべてのボード'
  },
  'error': {
    ru: 'Ошибка',
    en: 'Error',
    jp: 'エラー'
  },
  'threadNotFound': {
    ru: 'Тред не найден',
    en: 'Thread not found',
    jp: 'スレッドが見つかりません'
  },
  'noAnswersYet': {
    ru: 'Пока нет ответов',
    en: 'No answers yet',
    jp: 'まだ答えはありません'
  },
  'boards': {
    ru: 'Доски',
    en: 'Boards',
    jp: 'ボード'
  },
  'default': {
    ru: 'По умолчанию',
    en: 'Default',
    jp: 'デフォルトでは'
  },
  'popular': {
    ru: 'Популярные',
    en: 'Popular',
    jp: '人気'
  },
  'recentlyAnswered': {
    ru: 'Недавно отвеченные',
    en: 'Recently answered',
    jp: '最近答えした'
  },
  'byNewestThread': {
    ru: 'По новизне',
    en: 'By newest',
    jp: '最新のもの'
  },
  'byAnswersCount': {
    ru: 'По числу ответов',
    en: 'By answers count',
    jp: '答え数で'
  },
  'noBoardsYet': {
    ru: 'Пока нет досок',
    en: 'No boards yet',
    jp: 'ボードはまだありません'
  },
  'unableToDisplayBoards': {
    ru: 'Невозможно отобразить доски',
    en: 'Unable to display boards',
    jp: 'ボードを表示できません'
  },
  'board': {
    ru: 'Доска',
    en: 'Board',
    jp: 'ボード'
  },
  'unableToDisplayBoard': {
    ru: 'Невозможно отобразить доску',
    en: 'Unable to display board',
    jp: 'ボードを表示できません'
  },
  'unableToDisplayThreads': {
    ru: 'Невозможно отобразить треды',
    en: 'Unable to display threads',
    jp: 'スレッドを表示できません'
  },
  'adminDashboard': {
    ru: 'Панель администратора',
    en: 'Admin dashboard',
    jp: '管理ダッシュボード'
  },
  'dashboard': {
    ru: 'Панель управления',
    en: 'Dashboard',
    jp: 'ダッシュボード'
  },
  'admins': {
    ru: 'Администраторы',
    en: 'Admins',
    jp: '管理者'
  },
  'reports': {
    ru: 'Жалобы',
    en: 'Reports',
    jp: '苦情'
  },
  'bans': {
    ru: 'Баны',
    en: 'Bans',
    jp: '禁止'
  },
  'manageBoards': {
    ru: 'Управление досками',
    en: 'Manage boards',
    jp: 'ボードを管理する'
  },
  'createNewBoard': {
    ru: 'Создать новую доску',
    en: 'Create new board',
    jp: '新しいボードを作成する'
  },
  'enterShortName': {
    ru: 'Введите короткое имя',
    en: 'Enter short name',
    jp: '短い名前を入力してください'
  },
  'enterTitle': {
    ru: 'Введите название',
    en: 'Enter title',
    jp: 'タイトルを入力してください'
  },
  'enterPosition': {
    ru: 'Введите позицию',
    en: 'Enter position',
    jp: '位置を入力してください'
  },
  'thread1': {
    ru: 'тред',
    en: 'thread',
    jp: 'スレッド'
  },
  'thread2': {
    ru: 'треда',
    en: 'threads',
    jp: 'スレッド'
  },
  'thread3': {
    ru: 'тредов',
    en: 'threads',
    jp: 'スレッド'
  },
  'answer1': {
    ru: 'ответ',
    en: 'answer',
    jp: '答え'
  },
  'answer2': {
    ru: 'ответа',
    en: 'answers',
    jp: '答え'
  },
  'answer3': {
    ru: 'ответов',
    en: 'answers',
    jp: '答え'
  },
  'boardShortName': {
    ru: 'Короткое имя доски',
    en: 'Board short name',
    jp: 'ボードの短縮名'
  },
  'boardTitle': {
    ru: 'Название доски',
    en: 'Board title',
    jp: 'ボードタイトル'
  },
  'boardDescription': {
    ru: 'Описание доски',
    en: 'Board description',
    jp: '説明を入力してください'
  },
  'enterDescription': {
    ru: 'Ведите описание',
    en: 'Enter description',
    jp: '説明を入力してください'
  },
  'boardPosition': {
    ru: 'Позиция доски',
    en: 'Boards position',
    jp: 'ボードの位置'
  },
  'save': {
    ru: 'Сохранить',
    en: 'Save',
    jp: 'セーブ'
  },
  'create': {
    ru: 'Создать',
    en: 'Create',
    jp: '作成する'
  },
  'cancel': {
    ru: 'Отменить',
    en: 'Cancel',
    jp: 'キャンセル'
  },
  'noBansYet': {
    ru: 'Пока нет банов',
    en: 'No bans yet',
    jp: 'まだ禁止はありません'
  },
  'unableToDisplayBans': {
    ru: 'Невозможно отобразить баны',
    en: 'Unable to display bans',
    jp: '禁止を表示できません'
  },
  'signIn': {
    ru: 'Войти',
    en: 'Sign In',
    jp: 'ログイン'
  },
  'enterYourName': {
    ru: 'Введите свой логин',
    en: 'Enter your username',
    jp: 'ユーザー名を入力して下さい'
  },
  'enterPassword': {
    ru: 'Введите пароль',
    en: 'Enter password',
    jp: 'パスワードを入力する'
  },
  'logInAccount': {
    ru: 'Войти в аккаунт',
    en: 'Login account',
    jp: 'ログインアカウント'
  },
  'username': {
    ru: 'Логин',
    en: 'Username',
    jp: 'ユーザー名'
  },
  'password': {
    ru: 'Пароль',
    en: 'Password',
    jp: 'パスワード'
  },
  'or': {
    ru: 'Или',
    en: 'Or',
    jp: 'または'
  },
  'ifYouDontHaveAnAccount': {
    ru: 'если у вас нет аккаунта',
    en: 'if you don\'t have an account',
    jp: 'アカウントをお持ちでない場合'
  },
  'signUp': {
    ru: 'Регистрация',
    en: 'Sign Up',
    jp: '登録'
  },
  'enterEmail': {
    ru: 'Введите email',
    en: 'Enter email',
    jp: 'メールアドレスを入力して'
  },
  'passwordsNotMatch': {
    ru: 'пароли не совпадают',
    en: 'Passwords not match',
    jp: 'パスワードが一致しません'
  },
  'createYourAccount': {
    ru: 'Создать учетную запись',
    en: 'Create your account',
    jp: 'アカウントを作成'
  },
  'emailAddress': {
    ru: 'Адрес электронной почты',
    en: 'Email address',
    jp: 'メールアドレス'
  },
  'confirmPassword': {
    ru: 'Подтверждение пароля',
    en: 'Confirm password',
    jp: 'パスワードの確認'
  },
  'createAccount': {
    ru: 'Зарегистрироваться',
    en: 'Create account',
    jp: 'アカウントを作成する'
  },
  'ifYouAlreadyHaveAnAccount': {
    ru: 'если у вас уже есть аккаунт',
    en: 'if you already have an account',
    jp: 'すでにアカウントをお持ちの場合'
  },
  'enterThreadTitle': {
    ru: 'Введите название треда',
    en: 'Enter thread title',
    jp: 'スレッドのタイトルを入力してください'
  },
  'enterContent': {
    ru: 'Введите содержание',
    en: 'Enter content',
    jp: 'コンテンツを入力してください'
  },
  'chooseFromList': {
    ru: 'Выберите из списка',
    en: 'Choose from list',
    jp: 'リストから選択'
  },
  'boardsNotLoaded': {
    ru: 'Доски не загружены',
    en: 'Boards not loaded',
    jp: 'ボードがロードされていません'
  },
  'enterReason': {
    ru: 'Введите причину',
    en: 'Enter reason',
    jp: '理由を入力してください'
  },
  'enterDate': {
    ru: 'Введите дату',
    en: 'Enter date',
    jp: '日付を入力してください'
  },
  'newThread': {
    ru: 'Новый тред',
    en: 'New thread',
    jp: '新しいスレッド'
  },
  'threadTitle': {
    ru: 'Заголовок треда',
    en: 'Thread title',
    jp: 'スレッドタイトル'
  },
  'content': {
    ru: 'Содержание',
    en: 'Content',
    jp: 'コンテンツ'
  },
  'chooseABoard': {
    ru: 'Выберите доску',
    en: 'Choose a board',
    jp: 'ボードを選択してください'
  },
  'select': {
    ru: 'Выберите',
    en: 'Select',
    jp: '選び出す'
  },
  'loading': {
    ru: 'Загрузка',
    en: 'Loading',
    jp: '荷積'
  },
  'createThread': {
    ru: 'Создать тред',
    en: 'Create thread',
    jp: 'スレッドを作成する'
  },
  'answerInThread': {
    ru: 'Ответить в тред',
    en: 'Answer in thread',
    jp: 'スレッドに答え'
  },
  'answer': {
    ru: 'Ответить',
    en: 'Answer',
    jp: '答え'
  },
  'editAnswer': {
    ru: 'Редактировать ответ',
    en: 'Edit answer',
    jp: '答えを編集する'
  },
  'edit': {
    ru: 'Редактировать',
    en: 'Edit',
    jp: '編集'
  },
  'editThread': {
    ru: 'Редактировать тред',
    en: 'Edit thread',
    jp: 'スレッド編集'
  },
  'banUser': {
    ru: 'Забанить',
    en: 'Ban user',
    jp: '禁止'
  },
  'reason': {
    ru: 'Причина',
    en: 'Reason',
    jp: '理由'
  },
  'banDuration': {
    ru: 'Продолжительность бана',
    en: 'Ban duration',
    jp: '禁止期間'
  },
  'ban': {
    ru: 'Забанить',
    en: 'Ban',
    jp: '禁止'
  },
  'createNew': {
    ru: 'Создать тред',
    en: 'Create new',
    jp: '新しく作る'
  },
  'messages': {
    ru: 'Сообщения',
    en: 'Messages',
    jp: 'メッセージ'
  },
  'rules': {
    ru: 'Правила',
    en: 'Rules',
    jp: 'ルール'
  },
  'enterForSearch': {
    ru: 'Введите для поиска',
    en: 'Enter for search',
    jp: '検索'
  },
  'noNotificationYet': {
    ru: 'Уведомлений пока нет',
    en: 'No notification yet',
    jp: 'まだ通知はありません'
  },
  'deleteAllNotifications': {
    ru: 'Удалить все уведомления',
    en: 'Delete all notifications',
    jp: 'すべての通知を削除します'
  },
  'unableToDisplayNotifications': {
    ru: 'Невозможно отобразить уведомления',
    en: 'Unable to display notifications',
    jp: '通知を表示できません'
  },
  'openProfile': {
    ru: 'Открыть профиль',
    en: 'Open profile',
    jp: 'プロフィールを開く'
  },
  'language': {
    ru: 'Язык',
    en: 'Language',
    jp: '言語'
  },
  'toggleTheme': {
    ru: 'Переключить тему',
    en: 'Toggle theme',
    jp: 'テーマを切り替える'
  },
  'logout': {
    ru: 'Выйти',
    en: 'Logout',
    jp: 'ログアウト'
  },
  'chooseAFile': {
    ru: 'Выберите файл',
    en: 'Choose a file',
    jp: 'ファイルを選択してください'
  },
  'choose': {
    ru: 'Выбрать',
    en: 'Choose',
    jp: '選びとる'
  },
  'fileNotSelected': {
    ru: 'Файл не выбран',
    en: 'File not selected',
    jp: 'ファイルが選択されていません'
  },
  'attachFile': {
    ru: 'Прикрепить файл',
    en: 'Attach file',
    jp: 'ファイルを添付する'
  },
  'perFile': {
    ru: 'на файл',
    en: 'per file',
    jp: 'ファイルごと'
  },
  'textFieldSupportsMarkdown': {
    ru: 'Текстовое поле поддерживает Markdown',
    en: 'Text field supports Markdown',
    jp: 'テキストフィールドはMarkdownをサポートします'
  },
  'pin': {
    ru: 'Закрепить',
    en: 'Pin',
    jp: 'ピン'
  },
  'unpin': {
    ru: 'Открепить',
    en: 'Unpin',
    jp: '固定を解除する'
  },
  'open': {
    ru: 'Открыть',
    en: 'Open',
    jp: '開いた'
  },
  'close': {
    ru: 'Закрыть',
    en: 'Close',
    jp: '閉じる'
  },
  'delete': {
    ru: 'Удалить',
    en: 'Delete',
    jp: 'デリート'
  },
  'unbanUser': {
    ru: 'Разбанить',
    en: 'Unban user',
    jp: '禁止を解除する'
  },
  'report': {
    ru: 'Пожаловаться',
    en: 'Report',
    jp: '不平を言う'
  },
  'like1': {
    ru: 'лайк',
    en: 'like',
    jp: 'いいね'
  },
  'like2': {
    ru: 'лайка',
    en: 'likes',
    jp: 'いいね'
  },
  'like3': {
    ru: 'лайков',
    en: 'likes',
    jp: 'いいね'
  },
  'banExpires': {
    ru: 'Бан истекает',
    en: 'Ban expires',
    jp: '禁止期間が終了します'
  },
  'userBanned': {
    ru: 'Пользователь забанен',
    en: 'User banned',
    jp: 'ユーザー禁止'
  },
  'unread': {
    ru: 'Непрочитанные',
    en: 'Unread',
    jp: 'すでに読んだ'
  },
  'read': {
    ru: 'Прочитанные',
    en: 'Read',
    jp: '読む'
  },
  'noReportsYet': {
    ru: 'Пока нет жалоб',
    en: 'No reports yet',
    jp: 'まだ苦情はありません'
  },
  'unableToDisplayReports': {
    ru: 'Невозможно отобразить жалобы',
    en: 'Unable to display reports',
    jp: '苦情を表示できません'
  },
  'reportSent': {
    ru: 'Жалоба отправлена',
    en: 'Report sent',
    jp: '苦情が送信されました'
  },
  'search': {
    ru: 'Поиск',
    en: 'Search',
    jp: '検索'
  },
  'searchResults': {
    ru: 'Результаты поиска',
    en: 'Search results',
    jp: 'の検索結果'
  },
  'enterYourSearchTerm': {
    ru: 'Введите запрос для поиска',
    en: 'Enter your search term',
    jp: '検索語を入力してください'
  },
}

export { BACKEND, Strings };
