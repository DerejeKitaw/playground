import { ModelProxy } from '../main/model_proxy'
import { LoadModal, LoadFileEvent } from '../view_models/load_modal'
import { CommonViewModel } from '../view_models/common_view_model'
import { WebApiParser as wap } from 'webapi-parser'

export type EditorSection = 'raml' | 'graph';

export class ViewModel extends CommonViewModel {
  public base = window.location.href.toString().split('/starter_guide.html')[0]

  constructor (public ramlEditor: any) {
    super()

    this.loadModal.on(LoadModal.LOAD_FILE_EVENT, (evt: LoadFileEvent) => {
      return wap.raml10.parse(evt.location)
        .then((parsedModel) => {
          this.model = new ModelProxy(parsedModel, 'raml')
          this.ramlEditor.setValue(parsedModel.raw)
        })
        .catch((err) => {
          console.error(`Failed to parse file: ${err}`)
        })
    })
  }

  public getMainModel(): monaco.editor.ITextModel {
    return this.ramlEditor.getModel()
  }

  public loadInitialDocument () {
    const params = new URLSearchParams(window.location.search)
    if (params.get(this.queryParamName)) {
      return
    }

    this.loadModal.fileUrl(
      `${this.base}/examples/world-music-api/api.raml`)
    this.loadModal.save()
  }

  public parseEditorSection (section?: EditorSection) { }

  protected updateEditorsModels () { }
}
