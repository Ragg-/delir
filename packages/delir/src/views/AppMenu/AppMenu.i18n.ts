import I18n from '../../utils/I18n'

export default I18n({
  ja: {
    appMenu: {
      about: 'Delirについて',
      preference: '環境設定',
      openPluginDir: 'プラグインディレクトリを開く',
      quit: 'Delirを終了',
    },
    file: {
      label: 'ファイル',
      newProject: '新規プロジェクト',
      openProject: 'プロジェクトを開く',
      save: '保存',
      saveAs: '別名で保存',
      importProjectPack: 'パッケージからプロジェクトを開く',
      exportProjectPack: 'プロジェクトをパッケージ',
      rendering: 'レンダリング',
    },
    edit: {
      label: '編集',
      undo: '元に戻す',
      redo: 'やり直し',
      cut: '切り取り',
      copy: 'コピー',
      paste: '貼り付け',
      selectAll: 'すべて選択',
    },
    preview: {
      label: 'プレビュー',
      play: '再生',
      pause: '停止',
    },
    develop: {
      label: '開発',
      reload: 'リロード',
      toggleDevTool: '開発者ツールの切り替え',
    },
    help: {
      label: 'ヘルプ',
    },
    modals: {
      saveAs: {
        title: '新しいファイルに保存',
        save: '保存',
      },
      importProject: {
        title: 'パッケージからプロジェクトを開く',
        open: '開く',
        titleExtract: 'プロジェクトの展開先を選択',
        extract: '展開',
      },
      exportProject: {
        title: 'プロジェクトパッケージを保存',
        save: '保存',
      },
      openProject: {
        title: 'プロジェクトを開く',
        confirm: '現在のプロジェクトを破棄してプロジェクトを開きますか？',
        continue: '続ける',
        cancel: 'キャンセル',
      },
      newProject: {
        confirm: '現在のプロジェクトを破棄してプロジェクトを開きますか？',
        continue: '続ける',
        cancel: 'キャンセル',
      },
    },
  },
  en: {
    appMenu: {
      about: 'About Delir',
      preference: 'Preference',
      openPluginDir: 'Open plugins directory',
      quit: 'Quit Delir',
    },
    file: {
      label: 'File',
      newProject: 'New Project',
      openProject: 'Open',
      save: 'Save',
      saveAs: 'Save as ...',
      importProjectPack: 'Import project from .delirpp',
      exportProjectPack: 'Export project as package',
      rendering: 'Rendering',
    },
    edit: {
      label: 'Edit',
      undo: 'Undo',
      redo: 'Redo',
      cut: 'Cut',
      copy: 'Copy',
      paste: 'Paste',
      selectAll: 'Select All',
    },
    preview: {
      label: 'Preview',
      play: 'Play',
      pause: 'Pause',
    },
    develop: {
      label: 'Development',
      reload: 'Reload',
      toggleDevTool: 'Toggle DevTools',
    },
    help: {
      label: 'Help',
    },
    modals: {
      saveAs: {
        title: 'Save as ...',
        save: 'Save',
      },
      importProject: {
        title: 'Import project from .delirpp',
        open: 'Open',
        titleExtract: 'Select where to extract the project',
        extract: 'Extract',
      },
      exportProject: {
        title: 'Save project package',
        save: 'Save',
      },
      openProject: {
        title: 'Open Project',
        confirm: 'Do you want to destroy the current project and open the project?',
        continue: 'Continue',
        cancel: 'Cancel',
      },
      newProject: {
        confirm: 'Do you want to destroy the current project and open the project?',
        continue: 'Continue',
        cancel: 'Cancel',
      },
    },
  },
})
